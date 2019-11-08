<template>
  <div>
    <el-button type="primary" @click="chooseFile">选择文件</el-button>
    <input type="file" name="video" :id="id" ref="fileInput" style="display:none;" />
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
            v-if="uploadStep < chunks"
          >确认上传</a>
          <span v-else>上传成功</span>
        </span>
      </div>
      <div v-if="isUploading" class="mt-2 text-gray-600">上传中, 完成 {{uploadStep}} / {{ chunks}} ...</div>
      <div v-if="uploadError" class="mt-2 text-red-600">{{ uploadError }}</div>
    </div>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";
import axios from "./../server/axios";

export default {
  data() {
    return {
      // id: "uploader",
      fileObject: {},
      fileMd5CheckProcess: "",
      fileMd5: "",
      fileExt: "",
      // chunkSize: 2048000,
      chunkSize: 500000,
      chunks: 0,
      currentChunk: 0,
      isUploading: false, // 是否上传中
      accpetTypeRule: this.accpetTypeLimit,
      accpetTypes: {
        "application/zip": "zip",
        "image/jpeg": "jpg",
        "image/png": "png",
        "video/mp4": "mp4"
      },
      uploadStep: 0,
      uploadError: ""
    };
  },
  props: {
    accpetTypeLimit: {
      type: String,
      default: "mp4|jpg|png",
      required: false
    }
  },
  computed: {
    id() {
      return "uploader_" + parseInt(Math.random() * 10000000);
    }
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
      if (type) {
        if (Object.keys(this.accpetTypes).indexOf(type) > -1) {
          this.fileExt = this.accpetTypes[type];
          // return true;
        } else {
          this.fileExt = "";
          this.$alert("不支持的文件类型");
          return false;
        }
      } else {
        this.fileExt = file.name.match(/\.(\w+)$/)[1];
      }

      if (this.accpetTypeRule.indexOf(this.fileExt) < 0) {
        this.$alert("不支持的文件类型");
        return false;
      } else {
        console.log("checkFileType ext:", this.fileExt);
        return true;
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
      this.uploadStep = 0;
      this.uploadError = "";
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
          // that.slices[that.currentChunk] = slice;
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

      if (this.uploadStep == this.chunks) {
        this.$emit("uploadSuccess", { md5: this.fileMd5 });
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
      return blobSlice.call(file, start, end);

      // let reader = new FileReader();
      // reader.readAsArrayBuffer(blobSlice.call(file, start, end));
      // return new Promise((r, j) => {
      //   reader.addEventListener("load", function(e) {
      //     //每10M切割一段,这里只做一个切割演示，实际切割需要循环切割，
      //     let slice = e.target.result;
      //     r(slice);
      //   });
      //   reader.addEventListener("error", function() {
      //     j(null);
      //   });
      // });
    },
    async uploadFileSlice() {
      // 分片上传
      console.log("uploadFileSlice start ...");
      let step = this.uploadStep || 0;
      let file = this.fileObject;
      console.log("uploadFileSlice file:", file);
      this.isUploading = true;
      try {
        let params = {
          md5: this.fileMd5,
          size: file.size,
          type: file.type,
          ext: this.fileExt,
          step: step,
          chunks: this.chunks
        };

        for (let index = step; index < this.chunks; index++) {
          console.log("uploadFileSlice step:", step);
          let slice = this.fileSliceAction(file, step);
          console.log("uploadFileSlice slice", slice);
          params.step = index;
          this.uploadStep = index;
          let retUp = await this.uploadFileRequest(slice, params);
          console.log("uploadFileSlice step retUp", step, retUp);
          let retUpJson = retUp ? JSON.parse(retUp) : {};
          console.log("uploadFileSlice step retUpJson", step, retUpJson);
          if (retUpJson.code != 0) {
            throw new Error(retUpJson.message || "未知错误");
          }
          // return retUp;
        }
        this.uploadStep += 1;
        this.isUploading = false;

        this.$emit("uploadSuccess", { md5: this.fileMd5 });
        return true;
      } catch (err) {
        this.uploadError = err.message || err;
        return null;
      }
    },
    uploadFileRequest(slice, params) {
      console.log("uploadFileRequest params", params);
      return new Promise((r, j) => {
        var data = new FormData();
        data.append("file", slice);

        var xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;

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
    console.log("uploader mounted");
    let that = this;
    let fileInputChange = async function() {
      let file = this.files[0];
      console.log(file);
      that.fileObject = file;

      // let checkFileType = that.checkFileType(that.fileObject);
      // if (!checkFileType) {
      //   return false;
      // }
      let checkFileTypeRet = that.checkFileType(file);
      console.log("checkFileType ret: ", checkFileTypeRet);
      if (!checkFileTypeRet) {
        // that.$alert("不支持的格式类型");
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

    // this.id = "uploader_" + parseInt(Math.random(0, 1) * 10000000);
    let uploaderId = this.id;
    console.log("uploaderId:", uploaderId);
    document
      .getElementById(uploaderId)
      .addEventListener("change", fileInputChange);

    // this.$refs[uploaderId].addEventListener("change", fileInputChange);
  }
};
</script>

<style>
</style>