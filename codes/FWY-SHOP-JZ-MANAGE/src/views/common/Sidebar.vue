<template>
  <div class="sidebar">
    <Menu
      accordion
      ref="sidebar"
      :active-name="sidebarSelected"
      width="auto"
      :open-names="[sidebarSelected.substr(0, 1)]"
    >
      <Submenu :name="menu.id + ''" v-for="(menu, index) in menus" :key="index">
        <template slot="title">
          <Icon :type="menu.icon"></Icon>
          {{ menu.name }}
        </template>
        <MenuItem
          v-for="(subMenu, subIndex) in menu.subs"
          :key="subIndex"
          :name="menu.id + '-' + subMenu.id"
          @click.native="$router.push({ name: subMenu.to })"
          >{{ subMenu.name }}</MenuItem
        >
      </Submenu>
    </Menu>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      sidebarSelected: "",
      menus: [
        {
          id: 1,
          name: "权限管理",
          icon: "person-stalker",
          subs: [
            {
              id: 1,
              name: "用户管理",
              to: "user",
            },
            {
              id: 2,
              name: "角色管理",
              to: "role",
            },
            {
              id: 3,
              name: "资源管理",
              to: "resource",
            },
            {
              id: 4,
              name: "平台管理",
              to: "platform",
            },
            {
              id: 5,
              name: "日志管理",
              to: "log",
            },
            // {
            //   id: 5,
            //   name: 'TOKEN管理',
            //   to: 'token',
            // }
          ],
        },
        // {
        //   id: 2,
        //   name: '数据管理',
        //   icon: 'ios-keypad',
        //   subs: [
        //     {
        //       id: 1,
        //       name: '日志管理',
        //       to: 'log',
        //     },
        // {
        //   id: 2,
        //   name: '数据字典管理',
        //   to: 'dictionary',
        // }
        //   ]
        // },
        // {
        //   id: 3,
        //   name: '管理监控',
        //   icon: 'ios-keypad',
        //   subs: [
        //     {
        //       id: 1,
        //       name: 'druid数据连接池',
        //       to: 'druid',
        //     }, {
        //       id: 2,
        //       name: 'dubbo服务平台',
        //       to: 'dubbo',
        //     }, {
        //       id: 3,
        //       name: 'API管理平台',
        //       to: 'swagger',
        //     }
        //   ]
        // }
      ],
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path;
    },
  },
  mounted() {
    this.sidebarSelected = this.$route.meta.sidebarSelected || "1-1";
    this.$nextTick(function () {
      this.$refs.sidebar.updateOpened();
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.sidebar {
  width: 240px;
  position: fixed;
  top: 72px;
  left: 0;
  bottom: 0;
  z-index: 20;
  overflow-y: hidden;
  background: red !important;
  padding-top: 8px;
  border-right: 1px solid #d7dde4;
  .ivu-menu-item-selected {
    background: #e6e6e6;
  }
}
</style>
