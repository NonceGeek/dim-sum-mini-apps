const category = [
  {
    key: 0,
    name: "饮食",
    questions: [
      {
        content: "我(ngo5)唔(m4)食(sik6)辣(laat6)嘢(ja5)",
        yueText: "我唔食辣嘢",
        originalText: "我不吃辣的东西",
        yueQuizText: "<div>我(ngo5)<ul></ul>(m4)食(sik6)辣(laat6)<ul></ul>(ja5)</div>",
        yueQuiz: ["吾", "唔", "野", "嘢"],
        yueQuizAnswer: ["唔", "嘢"],
        audioUrl: "/audio/food/yue1.m4a",
      },
      {
        content: "我(ngo5)中(ji3)意(sik6)食(je5)",
        originalText: "我喜欢吃东西",
        yueText: "我中意食",
        audioUrl: "/audio/food/yue2.m4a",
      },
    ],
  },
  {
    key: 1,
    name: "问路",
    questions: [
      {
        content: "依(ji1)个(go3)地(zi2)址(dim2)点(haang4)",
        originalText: "这个地址怎么走？",
      },
    ],
  },
  {
    key: 2,
    name: "景点",
    questions: [
      {
        content:
          "广(gwon2)州(zau1)灯(dang1)光(gwong1)秀(sau3)型(jing4)到(dou3)爆(baau3)",
        originalText: "广州灯光秀很酷炫",
      },
    ],
  },
  {
    key: 3,
    name: "住宿",
    questions: [
      {
        content: "寻(cam4)日(jat6)预(jyu6)约(joek3)咗(zo2)",
        originalText: "昨天预约了",
      },
    ],
  },
  {
    key: 4,
    name: "交通",
    questions: [
      {
        content:
          "去(heoi3)广(gwong2)州(zau1)塔(taap3)大(daai6)概(koi3)要(jiu3)几(gei2)耐(noi6)啊(aa)",
        originalText: "去广州塔大概要多久啊？",
      },
    ],
  },
  {
    key: 5,
    name: "询问",
    questions: [
      {
        content: "点(im2)解(gaai2)嘅(ge2)",
        originalText: "为什么呢？",
      },
    ],
  },
  {
    key: 6,
    name: "回答",
    questions: [
      {
        content: "冇(u5)问(man6)题(tai4)",
        originalText: "没问题",
      },
    ],
  },
];
export type Category = (typeof category)[number];
export default category;
