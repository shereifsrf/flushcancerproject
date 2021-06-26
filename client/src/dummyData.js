export const campaigns = [
  {
    id: 1,
    userId: 1,
    categoryId: 1,
    name: "My Kid is sufferring from cancer",
    description:
      "This is going to be a big story, but let me make it short and simple as possible. He was studying at grade 2 when he it all started.........",
    limit: 1000,
    "total-donated": 800,
    isVerified: true,
  },
  {
    id: 2,
    userId: 1,
    categoryId: 1,
    name: "Please support our classmate John for his cancer treatment",
    description:
      "John is a great friend of ours. He has a very good smile wheever he meets someone. We didnt think him getting cancer as his soul was so pure. But unfortunately ..........",
    limit: 2000,
    "total-donated": 500,
    isVerified: true,
  },
  {
    id: 3,
    userId: 1,
    categoryId: 1,
    name: "Campaign 3 ",
    description: "Campaign 3 Description ",
    limit: 3000,
    "total-donated": 900,
    isVerified: true,
  },
  {
    id: 5,
    userId: 1,
    categoryId: 2,
    name: "Campaign 5 ",
    description:
      "Campaign 5 Description asdkjgasdkjgakjsd gadsk jagsdkhjgas kasd jhagsd agsgd aksgd aksdgkasgdkagjhsdka askjdg askjdg Campaign 5 Description asdkjgasdkjgakjsd gadsk jagsdkhjgas kasd jhagsd agsgd aksgd aksdgkasgdkagjhsdka askjdg askjdg Campaign 5 Description asdkjgasdkjgakjsd gadsk jagsdkhjgas kasd jhagsd agsgd aksgd aksdgkasgdkagjhsdka askjdg askjdg Campaign 5 Description asdkjgasdkjgakjsd gadsk jagsdkhjgas kasd jhagsd agsgd aksgd aksdgkasgdkagjhsdka askjdg askjdg Campaign 5 Description asdkjgasdkjgakjsd gadsk jagsdkhjgas kasd jhagsd agsgd aksgd aksdgkasgdkagjhsdka askjdg askjdg Campaign 5 Description asdkjgasdkjgakjsd gadsk jagsdkhjgas kasd jhagsd agsgd aksgd aksdgkasgdkagjhsdka askjdg askjdg Campaign 5 Description asdkjgasdkjgakjsd gadsk jagsdkhjgas kasd jhagsd agsgd aksgd aksdgkasgdkagjhsdka askjdg askjdg ",
    limit: 5000,
    "total-donated": 3500,
    isVerified: false,
  },
  {
    id: 4,
    userId: 1,
    categoryId: 1,
    name: "Campaign 4 ",
    description: "Campaign 4 Description ",
    limit: 4000,
    "total-donated": 2400,
    isVerified: false,
  },
];

export const categories = [
  {
    id: 1,
    name: "Cat1 Stage1",
  },
  {
    id: 2,
    name: "Cat2 Stag2",
  },
];

export const users = [
  {
    id: 1,
    email: "test@g.c",
    password: "pass",
    isCampaigner: false,
    isVerified: false,
  },
  {
    id: 2,
    email: "test2@g.c",
    password: "pass",
    isCampaigner: true,
    isVerified: true,
  },
];

export const donations = [
  {
    id: 1,
    userId: 1,
    campaignId: 1,
    donation: 200,
  },
  {
    id: 2,
    userId: 1,
    campaignId: 2,
    donation: 500,
  },
  {
    id: 3,
    userId: 2,
    campaignId: 1,
    donation: 350,
  },
];
