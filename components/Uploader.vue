<template>
  <div>
    <el-button type="primary" @click="chooseFile">选择文件</el-button>
    <input type="file" name="video" id="uploader" ref="fileInput" style="display:none;" />
    <div class="mt-2">
      <span class="text-black">{{fileObject.name}}</span>
      <div v-if="currentChunk != chunks" class="mt-2 text-gray-600">
        <span>文件校验中 {{fileMd5CheckProcess}} ...</span>
      </div>
      <div v-if="fileMd5" class="mt-2 text-gray-600">
        <span>
          校验成功, 文件hash:{{ fileMd5 }},
          <a
            @click="uploadFileSlice"
            class="text-blue-500 cursor-pointer"
          >确认上传</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";

export default {
  data() {
    return {
      fileObject: {},
      fileMd5CheckProcess: "",
      fileMd5: "",
      chunkSize: 2048000,
      chunks: 0,
      currentChunk: 0,
      isUploading: false, // 是否上传中
      accpetTypes: {
        "application/zip": "zip",
        "image/jpeg": "jpg"
      }
    };
  },
  methods: {
    // fileReader: function() {
    //   console.log(arguments);
    // }
    chooseFile() {
      if (this.isUploading) {
        this.$alert("上传中。。。");
        return;
      }
      this.$refs.fileInput.click();
    },
    checkFileType(file) {
      let type = file.type;
      if (Object.keys(this.accpetTypes).indexOf(type) > -1) {
        file.ext = this.accpetTypes[type];
        return true;
      } else {
        file.ext = "";
        this.$alert("不支持的文件类型");
        return false;
      }
    },
    readFileMd5(file) {
      console.log("readFileMd5 start .....");
      // let chunkSize = 2048000; // Read in chunks of 2MB
      let that = this;
      let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice;
      let chunks = Math.ceil(file.size / that.chunkSize);
      console.log("readFileMd5 chunks:", chunks);
      this.chunks = chunks;
      this.currentChunk = 0;
      this.fileMd5 = "";
      // let currentChunk = this.currentChunk;
      let spark = new SparkMD5.ArrayBuffer();
      let fileReader = new FileReader();

      return new Promise((r, j) => {
        fileReader.onload = function(e) {
          that.fileMd5CheckProcess = that.currentChunk + 1 + "/" + chunks;
          console.log(
            "readFileMd5 read chunk nr",
            that.currentChunk + 1,
            "/",
            chunks
          );
          spark.append(e.target.result); // Append array buffer
          that.currentChunk++;

          if (that.currentChunk < chunks) {
            loadNext();
          } else {
            let hashMd5 = spark.end();
            console.info("readFileMd5 computed hash:", hashMd5); // Compute hash
            console.log("readFileMd5 end .....");
            r(hashMd5);
          }
        };

        fileReader.onerror = function() {
          console.log("readFileMd5 fail .....");
          r(null);
        };

        let loadNext = () => {
          let start = that.currentChunk * that.chunkSize;
          let end =
            start + that.chunkSize >= file.size
              ? file.size
              : start + that.chunkSize;

          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        };

        loadNext();
      });
    },
    uploadFileSlice() {
      // 分片上传
      console.log("uploadFileSlice start ...");
    }
  },
  created: function() {
    console.log("uploader created");
  },
  mounted: function() {
    // this.$nextTick(function() {
    //   // Code that will run only after the
    //   // entire view has been rendered
    //   console.log("uploader mounted" ....);
    // });
    console.log("uploader mounted");
    let that = this;
    let fileInputChange = async function() {
      let file = this.files[0];
      console.log(file);
      that.fileObject = file;

      let checkFileType = that.checkFileType(that.fileObject);
      if (!checkFileType) {
        return false;
      }
      try {
        let fileMd5 = await that.readFileMd5(file);
        that.fileMd5 = fileMd5;
      } catch (err) {
        this.$alert("校验文件失败");
      }
    };
    document
      .getElementById("uploader")
      .addEventListener("change", fileInputChange);
  }
};
</script>

<style>
</style>