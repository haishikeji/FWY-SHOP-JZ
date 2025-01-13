<template>
  <div id="app">
    <router-view name="header" v-if="$route.meta.top || true"></router-view>
    <!-- <router-view name="sidebar"></router-view> -->
    <Row
      :style="{
        height:
          $route.meta.silder != undefined && $route.meta.silder == true
            ? 'calc(100vh - 50px)'
            : 'calc(100vh)',
      }"
    >
      <Col
        span="4"
        v-if="$route.meta.silder != undefined ? $route.meta.silder : true"
      >
        <Menu
          ref="left_menu"
          :active-name="$route.meta.sidebarSelected || '1'"
          :open-names="openMenu"
          style="
            width: 100%;
            overflow-y: auto;
            background: #002140;
            width: 240px;
            color: #fff;
          "
          v-show="showSilder"
          :style="{
            height:
              $route.meta.silder != undefined && $route.meta.silder == true
                ? 'calc(100vh - 50px)'
                : 'calc(100vh - 50px)',
          }"
        >
          <!-- <Submenu name="1">
              <template slot="title">
                  <Icon type="ios-cube" />
                  绘本管理
              </template>
              <MenuItem name="1-1" @click.native="gotoPage('bookCategoryList')">绘本分类管理</MenuItem>
              <MenuItem name="1-2" @click.native="gotoPage('bookTagList')">绘本标签管理</MenuItem>
              <MenuItem name="1-3" @click.native="gotoPage('bookList')">绘本管理</MenuItem>
              <MenuItem name="1-4" @click.native="gotoPage('bookSeriesList')">绘本系列管理</MenuItem>
          </Submenu>

          <Submenu name="2">
              <template slot="title">
                  <Icon type="ios-cube" />
                  线下活动
              </template>
              <MenuItem name="2-1" @click.native="gotoPage('activityTypeList')">线下活动分类管理</MenuItem>
              <MenuItem name="2-2" @click.native="gotoPage('activityList')">线下活动管理</MenuItem>
              <MenuItem name="2-3" @click.native="gotoPage('activitySeriesList')">系列活动管理</MenuItem>
          </Submenu>

          <Submenu name="3">
              <template slot="title">
                  <Icon type="ios-cube" />
                  线上课程
              </template>
              <MenuItem name="3-1" @click.native="gotoPage('courseCategoryList')">线上课程分类管理</MenuItem>
              <MenuItem name="3-2" @click.native="gotoPage('courseTagList')">线上课程标签管理</MenuItem>
              <MenuItem name="3-3" @click.native="gotoPage('courseSeriesList')">系列课程管理</MenuItem>
              <MenuItem name="3-4" @click.native="gotoPage('courseList')">课程管理</MenuItem>
          </Submenu>

          <Submenu name="6">
              <template slot="title">
                  <Icon type="ios-cube" />
                  场馆管理
              </template>
              <MenuItem name="6-1" @click.native="gotoPage('placeList')">场馆维护</MenuItem>
          </Submenu>

          <Submenu name="7">
              <template slot="title">
                  <Icon type="ios-cube" />
                  餐饮管理
              </template>
              <MenuItem name="7-1" @click.native="gotoPage('mealTypeList')">菜品分类管理</MenuItem>
              <MenuItem name="7-2" @click.native="gotoPage('mealTagList')">备注标签管理</MenuItem>
              <MenuItem name="7-3" @click.native="gotoPage('mealList')">菜品管理</MenuItem>
              <MenuItem name="7-4" @click.native="gotoPage('mealOrderList')">餐饮订单管理</MenuItem>
              <MenuItem name="7-5" @click.native="gotoPage('mealOtherPrice')">送餐费设置</MenuItem>
              <MenuItem name="7-6">餐饮订单打印模板</MenuItem>
          </Submenu>

          <Submenu name="4">
              <template slot="title">
                  <Icon type="ios-cube" />
                  营销管理
              </template>
              <MenuItem name="4-1" @click.native="gotoPage('marketingAdvertList')">广告位管理</MenuItem>
          </Submenu>

          <Submenu name="8">
              <template slot="title">
                  <Icon type="ios-cube" />
                  订单管理
              </template>
              <MenuItem name="8-1" @click.native="gotoPage('orderList')">订单查询</MenuItem>
              <MenuItem name="8-2" @click.native="gotoPage('orderAppointment')">预约查询</MenuItem>
          </Submenu>

          <Submenu name="9">
              <template slot="title">
                  <Icon type="ios-cube" />
                  财务管理
              </template>
              <MenuItem name="9-1" @click.native="gotoPage('memberList')">会员管理</MenuItem>
              <MenuItem name="9-2">餐饮统计</MenuItem>
              <MenuItem name="9-3">绘本馆统计</MenuItem>
              <MenuItem name="9-4">推荐查询</MenuItem>
          </Submenu> -->

          <!-- lilt 开始 -->
          <Submenu name="100">
            <template slot="title">
              <Icon type="ios-cube" />
              锦囊管理
            </template>
            <MenuItem
              name="100-1"
              @click.native="gotoPage('standardCategoryList')"
              >标准分类管理</MenuItem
            >
            <MenuItem name="100-2" @click.native="gotoPage('standardList')"
              >标准管理</MenuItem
            >

            <Submenu name="100-3">
              <template slot="title">课堂管理</template>
              <MenuItem
                name="100-3-1"
                @click.native="gotoPage('courseCategoryList')"
                >课堂分类管理</MenuItem
              >
              <MenuItem
                name="100-3-2"
                @click.native="gotoPage('courseSeriesList')"
                >系列课程管理</MenuItem
              >
              <MenuItem name="100-3-3" @click.native="gotoPage('courseList')"
                >课程管理</MenuItem
              >
            </Submenu>
            <MenuItem name="100-4" @click.native="gotoPage('knackCategoryList')"
              >窍门分类管理</MenuItem
            >
            <MenuItem name="100-5" @click.native="gotoPage('knackList')"
              >窍门管理</MenuItem
            >
            <MenuItem name="100-6" @click.native="gotoPage('knackSeriesList')"
              >窍门系列管理</MenuItem
            >
          </Submenu>
          <Submenu name="110">
            <template slot="title">
              <Icon type="ios-cube" />
              产品管理
            </template>
            <MenuItem
              name="110-1"
              @click.native="gotoPage('productCategoryList')"
              >产品分类管理</MenuItem
            >
            <MenuItem name="110-2" @click.native="gotoPage('businessList')"
              >商家管理</MenuItem
            >
            <MenuItem name="110-5" @click.native="gotoPage('exhibitionList')"
              >展厅管理</MenuItem
            >
            <MenuItem name="110-3" @click.native="gotoPage('productList')"
              >产品管理</MenuItem
            >
            <MenuItem name="110-4" @click.native="gotoPage('productCaseList')"
              >案例管理</MenuItem
            >
          </Submenu>
          <Submenu name="120">
            <template slot="title">
              <Icon type="ios-cube" />
              咨询管理
            </template>
            <!-- <MenuItem name="120-1" @click.native="gotoPage('questionCategoryList')">咨询分类管理</MenuItem>
              <MenuItem name="120-2" @click.native="gotoPage('questionList')">问题咨询列表</MenuItem> -->
            <MenuItem
              name="120-3"
              @click.native="gotoPage('zhuanjiaQuestionList')"
              >专家咨询列表</MenuItem
            >
          </Submenu>
          <Submenu name="130">
            <template slot="title">
              <Icon type="ios-cube" />
              用户管理
            </template>
            <MenuItem name="130-1" @click.native="gotoPage('userList')"
              >人员管理</MenuItem
            >
            <MenuItem name="130-2" @click.native="gotoPage('memberList')"
              >普通用户管理</MenuItem
            >
          </Submenu>
          <Submenu name="140">
            <template slot="title">
              <Icon type="ios-cube" />
              营销管理
            </template>
            <MenuItem
              name="140-1"
              @click.native="gotoPage('marketingAdvertList')"
              >广告位管理</MenuItem
            >
          </Submenu>
          <Submenu name="150">
            <template slot="title">
              <Icon type="ios-cube" />
              配置管理
            </template>
            <MenuItem name="150-1" @click.native="gotoPage('dictionaryList')"
              >编码管理</MenuItem
            >
          </Submenu>
        </Menu>
      </Col>
      <Col
        :span="
          $route.meta.silder != undefined || $route.meta.silder == false
            ? 24
            : 20
        "
        style="height: 100%; overflow-y: auto"
        :style="{
          paddingBottom:
            $route.meta.silder == undefined || $route.meta.silder == true
              ? '80px'
              : '0px',
        }"
      >
        <transition name="content" mode="out-in">
          <router-view :class="{ 'content-wrap': $route.meta.top != false }" />
        </transition>
      </Col>
    </Row>
    <!-- <router-view name="footer"></router-view> -->
  </div>
</template>

<script>
import { Row, Col, Menu, Submenu, MenuItem } from "iview";
import { mapState, mapActions } from "vuex";

import { baseUrl } from "@/config/env";

export default {
  name: "app",
  data() {
    return {
      openMenu: ["1"],
      showSilder: false,
    };
  },
  components: {
    Row,
    Col,
    Menu,
    Submenu,
    MenuItem,
  },
  computed: {
    ...mapState({}),
  },
  watch: {
    "$route.meta.sidebarSelected": {
      immediate: true,
      handler(val) {
        if (this.$route.meta.sidebarSelected) {
          // this.$nextTick(() => {
          this.openMenu = [];
          let selectedIdArray = this.$route.meta.sidebarSelected.split("-");
          if (selectedIdArray.length > 2) {
            this.openMenu.push(selectedIdArray[0]);
            this.openMenu.push(selectedIdArray[0] + "-" + selectedIdArray[1]);
          } else {
            this.openMenu.push(selectedIdArray[0]);
          }
          this.openNames();
          // })
        }
      },
    },
    $route: {
      immediate: true,
      handler(val) {
        if (val.fullPath != "/") {
          if (
            this.$route.meta.silder != undefined &&
            this.$route.meta.silder == false
          ) {
          } else {
            this.showSilder = true;
          }
        }
      },
    },
  },
  methods: {
    gotoPage(name) {
      if (!name) return;
      this.$router.push({ name: name });
    },
    openNames() {
      this.$nextTick(() => {
        this.$refs.left_menu.updateOpened();
        this.$refs.left_menu.updateActiveName();
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "./assets/sass/app.scss";

body,
html {
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ivu-message {
  top: 80px !important;
}

::-webkit-scrollbar-track-piece {
  //滚动条凹槽的颜色，还可以设置边框属性
  background-color: transparent;
}
::-webkit-scrollbar {
  //滚动条的宽度
  width: 9px;
  height: 9px;
}
::-webkit-scrollbar-thumb {
  //滚动条的设置
  background-color: #22bcf2;
  background-clip: padding-box;
  min-height: 28px;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #c8f1ff;
}

.ivu-select {
  .ivu-select-selection {
    border-radius: 0 !important;
    // border-color: #E5E5E5 !important;
  }
}
.ivu-input {
  border-radius: 0 !important;
  // border-color: #E5E5E5 !important;
}

.ivu-input[disabled],
fieldset[disabled] .ivu-input,
.ivu-select-disabled .ivu-select-selection {
  color: #333 !important;
}

.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
}

.filter-condition {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  // justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
}
.filter-condition .condition-item {
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
}
.filter-condition .condition-item .text {
  font-size: 16px;
  // color: #46ecff;
  vertical-align: middle;
  line-height: normal;
  margin-right: 5px;
  width: initial;
  display: inline-block;
}
.ivu-radio-inner {
  &:after {
    border-radius: 100% !important;
  }
}

.ivu-page {
  margin-top: 20px;
  text-align: right;
}
</style>

<!-- <style lang="scss" scoped>-->
<style lang="scss">
.content-wrap {
  // position: relative;
  padding: 20px;
  // padding-bottom: 182px;
  min-height: initial;
  // min-width: 767px;
  z-index: 22;
  // margin-left: 250px;
  // background-color: #fff;
  // padding: 20px 40px;
  flex: 1;
}
.ivu-input.ivu-input-default {
  // border-top: 0px;
  // border-left: 0px;
  // border-right: 0px;
  // border-radius: 0px;
  // background: none;

  &:focus {
    box-shadow: none;
  }
}
.ivu-select.ivu-select-default > .ivu-select-selection {
  // border-top: 0px;
  // border-left: 0px;
  // border-right: 0px;
  // border-radius: 0px;
  // background: none;

  &:focus {
    box-shadow: none;
  }
}
.ivu-menu-item {
  color: #fff !important;
}
.ivu-menu-item-active {
  // color: #2d8cf0 !important;
}
.ivu-menu-submenu {
  color: #fff !important;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background: #2d8cf0 !important;
}
</style>
