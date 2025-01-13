const Header = () => import('@/views/common/Header')
const Sidebar = () => import('@/views/common/Sidebar')

const MemberList = () => import('@/views/member/list/List')
const MemberEdit = () => import('@/views/member/list/Edit')

let routes = [
  {
    path: '/member/list',
    name: 'memberList',
    components: {
      default: MemberList,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '会员管理', sidebarSelected: '130-2' }
  },
  {
    path: '/member/add',
    name: 'memberAdd',
    components: {
      default: MemberEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '新增会员', sidebarSelected: '130-2', pageType: 'add' }
  },
  {
    path: '/member/edit/:id',
    name: 'memberEdit',
    components: {
      default: MemberEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '查看会员', sidebarSelected: '130-2', pageType: 'see' }
  },
];

export default routes;
