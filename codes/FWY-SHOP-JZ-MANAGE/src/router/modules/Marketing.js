const Header = () => import('@/views/common/Header')
const Sidebar = () => import('@/views/common/Sidebar')

const MarketingAdvertList = () => import('@/views/marketing/advert/List')
const MarketingAdvertItemList = () => import('@/views/marketing/advert-item/List')
const MarketingAdvertItemEdit = () => import('@/views/marketing/advert-item/Edit')

let routes = [
  {
    path: '/marketing/advert/list',
    name: 'marketingAdvertList',
    components: {
      default: MarketingAdvertList,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '广告位管理', sidebarSelected: '140-1' }
  },
  {
    path: '/marketing/advert/item/list/:id',
    name: 'marketingAdvertItemList',
    components: {
      default: MarketingAdvertItemList,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '广告位素材管理', sidebarSelected: '140-1' }
  },
  {
    path: '/marketing/advert/item/add',
    name: 'marketingAdvertAdd',
    components: {
      default: MarketingAdvertItemEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '新增广告位素材', sidebarSelected: '140-1', pageType: 'add' }
  },
  {
    path: '/marketing/advert/item/edit/:id',
    name: 'marketingAdvertEdit',
    components: {
      default: MarketingAdvertItemEdit,
      header: Header,
      sidebar: Sidebar
    },
    meta: { title: '修改广告位素材', sidebarSelected: '140-1' }
  },
];

export default routes;
