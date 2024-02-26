export enum Pages {
  HOME = '/',
  ACTIVITY = '/activity',
  CREATE_THREAD = '/create-thread',
  COMMUNITIES = '/communities',
  PROFILE = '/profile',
  PROFILE_EDIT = '/profile/edit',
  ONBOARDING = '/onboarding',
  SEARCH = '/search',
  SIGN_IN = '/sign-in',
  SIGN_UP = '/sign-up',
}

export const sidebarLinks = [
  {
    imgURL: "/assets/home.svg",
    route: Pages.HOME,
    label: "Home",
  },
  {
    imgURL: "/assets/search.svg",
    route: Pages.SEARCH,
    label: "Search",
  },
  {
    imgURL: "/assets/heart.svg",
    route: Pages.ACTIVITY,
    label: "Activity",
  },
  {
    imgURL: "/assets/create.svg",
    route: Pages.CREATE_THREAD,
    label: "Create Thread",
  },
  {
    imgURL: "/assets/community.svg",
    route: Pages.COMMUNITIES,
    label: "Communities",
  },
  {
    imgURL: "/assets/user.svg",
    route: Pages.PROFILE,
    label: "Profile",
  },
];