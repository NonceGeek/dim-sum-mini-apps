const category = [
  { key: 1, name: "饮食", questions: [{ content: "ngo5我m4唔sik6食laat6辣ja5嘢" }] },
  {
    key: 2,
    name: "问路",
    questions: [{ content: "ji1依go3个dei6地zi2址dim2点haang4" }],
  },
  {
    key: 3,
    name: "景点",
    questions: [{ content: "gwong2广zau1州dang1灯gwong1光sau3秀jing4型dou3到baau" }],
  },
  { key: 4, name: "住宿", questions: [{ content: "cam4寻jat6日jyu6预joek3约zo2" }] },
];
export type Category = (typeof category)[number];
export default category;
