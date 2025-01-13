<template>
  <div class="common-header">
    <Menu
      mode="horizontal"
      theme="dark"
      active-name="menu-1"
      class="header"
      :active-name="currentHeaderTab"
    >
      <div class="layout-logo">建材服务商城</div>
    </Menu>
  </div>
</template>

<script>
import { Menu, MenuItem, Avatar, Icon } from "iview";
import { mapState, mapActions } from "vuex";
import cookie from "@/utils/cookie";

import { loginBaseUrl } from "@/config/env";

export default {
  name: "Common-Header",
  data() {
    return {
      loginUrl: "",
      currentHeaderTab: "",
      usernameMenu: false,
      menus: [
        { num: "1", name: "首页", path: "index" },
        { num: "2", name: "证书办理", path: "transact" },
        { num: "3", name: "验证中心", path: "verification" },
      ],
    };
  },
  computed: {
    ...mapState({
      loginedUser: (state) => state.global.loginedUser,
    }),
  },
  components: {
    Menu,
    MenuItem,
    Avatar,
    Icon,
  },
  watch: {
    // '$route': function (route) {
    //   this.fetchMessageTotal();
    // },
    loginedUser: function (route) {
      // this.fetchMessageTotal();
    },
  },
  mounted() {
    // this.loginUrl = loginBaseUrl + window.location.href;
    this.currentHeaderTab = this.$route.meta.currentHeaderTab || "1";
    // this.loadLoginedUser();
  },
  methods: {
    ...mapActions(["valiToken", "userLogout"]),
    logout() {
      this.userLogout();
      window.location.href = "/";
    },
    loadLoginedUser() {
      if (!this.loginedUser || !this.loginedUser.username) {
        this.valiToken();
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../../assets/sass/init.scss";
.common-header {
  background-color: #fff;
  // position: fixed;
  z-index: 99999;
  width: 100%;
  border-bottom: 1px solid #eee;
}
.header {
  margin: 0 auto;
  height: 50px;
  line-height: 50px;
  background-color: #2d8cf0 !important;
  color: white;
  // background-image: linear-gradient(143deg, #2945cb 20%, #2b83f9 81%, #3a9dff);
}

.layout-logo {
  // width: 100px;
  // width: 237px;
  padding-left: 20px;
  border-radius: 3px;
  float: left;
  position: relative;
  font-size: 30px;
  // padding-left: 20px;
  // top: 13px;
  // left: 20px;
}

.layout-nav {
  // width: 470px;
  margin: 0 auto;
  .layout-nav-item {
    margin-right: 60px;
    padding: 0;
    &:nth-child(1) {
      margin-left: 104px;
    }
  }
}

.layout-avatar {
  // width: 100px;
  width: 350px;
  border-radius: 3px;
  float: right;
  text-align: right;
  position: absolute;
  font-size: 14px;
  // padding-right: 20px;
  top: 0px;
  right: 0px;
  .header-avatar {
    margin-right: 10px;
  }
  .header-username {
    color: white;
  }
  .header-split {
    display: inline-block;
    height: 20px;
    width: 1px;
    background: white;
    margin: 0px 10px;
    vertical-align: middle;
  }
  .header-logout {
    display: inline-block;
    width: 20px;
    vertical-align: middle;
  }
  a {
    &:hover {
      color: #37b2ff !important;
    }
  }

  .header-message {
    position: relative;
    .icon-message-count {
      min-width: 10px;
      text-align: center;
      line-height: 10px;
      display: inline-block;
      position: absolute;
      right: -10px;
      top: -12px;
      background: red;
      color: #fff;
      border-radius: 100%;
      padding: 6px;
      font-size: 16px;
      transform: scale(0.7);
      font-family: Tahoma !important;
    }
  }

  .username-menu {
    position: absolute;
    width: 134px;
    text-align: left;
    // padding: 10px 0px;
    background: #fff;
    top: 60px;
    left: -20px;
    // border: 1px solid #fff;
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.06);
    p {
      margin: 5px 0;
      height: 25px;
      line-height: 20px;
      cursor: pointer;
      &:hover {
        color: #37b2ff;
      }
    }
  }

  .down-arrow {
    width: 12px;
    // vertical-align: middle;
  }
}

.common-header {
  .ivu-menu-item {
    color: #333 !important;
    font-size: 16px;
    &:hover {
      color: #37b2ff !important;
      font-weight: bold;
    }
  }
  .ivu-menu-item-selected {
    color: #37b2ff !important;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
