const menu_data = [
  {
    id: 1,
    mega_menu: false,
    has_dropdown: false,
    title: 'Dashboard',
    link: '/',
    active: 'active'
  },
  {
    id: 2,
    mega_menu: false,
    has_dropdown: false,
    title: 'Start Earning',
    link: '/all-games',
    active: ''
  },
  {
    id: 3,
    mega_menu: false,
    has_dropdown: false,
    title: 'Instruction',
    link: '/instruction',
    active: ''
  },
  {
    id: 4,
    mega_menu: false,
    has_dropdown: true,
    title: 'More',
    link: '/',
    active: '',
    sub_menus: [
      { link: '/contact-us', title: 'Contact Us' },
      { link: '/about-us', title: 'About Us' },
      { link: '/terms-conditions', title: 'Terms and Conditions' },
      { link: '/privacy-policy', title: 'Privacy Policy' }
    ]
  }
]
export default menu_data
