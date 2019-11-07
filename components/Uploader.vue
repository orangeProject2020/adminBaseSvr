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
import axios from "./../server/axios";

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
      },
      uploadStep: 0,
      slices: []
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
          let slice = e.target.result;
          spark.append(slice); // Append array buffer
          // 加载文件切片
          that.slices[that.currentChunk] = slice;
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
    async getFileUploadedInfo(md5) {
      let ret = await axios.post("/api/utils/file/getItem", { md5: md5 });
      console.log("getFileUploadedInfo ret", ret);
      if (ret.code === 0 && ret.data) {
        this.uploadStep = ret.data.step || 0;
      } else {
        this.uploadStep = 0;
      }
      console.log("getFileUploadedInfo this.uploadStep:", this.uploadStep);
      return ret;
    },
    fileSliceAction(file, step = 0, cb) {
      let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice;
      let start = step * this.chunkSize;
      let end =
        start + this.chunkSize >= file.size
          ? file.size
          : start + this.chunkSize;

      let reader = new FileReader();
      reader.readAsArrayBuffer(blobSlice.call(file, start, end));
      return new Promise((r, j) => {
        reader.addEventListener("load", function(e) {
          //每10M切割一段,这里只做一个切割演示，实际切割需要循环切割，
          let slice = e.target.result;
          r(slice);
        });
        reader.addEventListener("error", function() {
          j(null);
        });
      });
    },
    async uploadFileSlice() {
      // 分片上传
      console.log("uploadFileSlice start ...");
      let step = this.uploadStep || 0;
      let file = this.fileObject;
      console.log("uploadFileSlice file:", file);
      try {
        let params = {
          md5: this.fileMd5,
          size: file.size,
          type: file.type,
          ext: file.ext,
          step: step,
          chunks: this.chunks
        };

        for (let index = step; index < this.chunks; index++) {
          console.log("uploadFileSlice step:", step);
          let slice = await this.fileSliceAction(file, step);
          console.log("uploadFileSlice slice", slice);
          params.step = index;
          let retUp = await this.uploadFileRequest(slice, params);
          console.log("uploadFileSlice step retUp", step, retUp);
          return retUp;
        }
      } catch (err) {
        return null;
      }
    },
    uploadFileRequest(slice, params) {
      console.log("uploadFileRequest params", params);
      return new Promise((r, j) => {
        var data = new FormData();
        data.append("file", slice);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
          if (this.readyState === 4) {
            console.log("uploadFileRequest responseText", this.responseText);
            // console.log(this.responseText);
            r(this.responseText);
          }
        });

        let url =
          process.env.nodeEnv == "production"
            ? process.env.apiHttpHost
            : process.env.apiHttpHostLocal;
        url += "/upload/slice";
        url += "?md5=" + params.md5;
        url += "&size=" + params.size;
        url += "&type=" + params.type;
        url += "&ext=" + params.ext;
        url += "&step=" + params.step;
        url += "&chunks=" + params.chunks;
        console.log("uploadFileRequest url", url);
        xhr.open("POST", url);

        xhr.send(data);
      });
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
        await that.getFileUploadedInfo(fileMd5);
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