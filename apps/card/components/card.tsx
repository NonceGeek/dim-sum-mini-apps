"use client";
import { CorpusItem } from "@/types";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { sify, tify } from "chinese-conv/dist";
import Post from "./post";
import CardContent from "./cardContent";
import { useSearchParams } from "next/navigation";

const bgColorOptions = [
  { name: "黑色", value: "bg-stone-950" },
  {
    name: "白色",
    value: "bg-slate-50",
  },
  {
    name: "灰色",
    value: "bg-slate-300",
  },
  {
    name: "藏蓝",
    value: "bg-blue-200",
  },
  {
    name: "渐变色",
    value: "bg-gradient-to-r from-purple-400 to-purple-100 ",
  },
  {
    name: "主题色",
    value: "bg-fuchsia-300",
  },
];
const fontColorOptions = [
  {
    name: "白色",
    value: "text-slate-50",
    bg: "bg-slate-50",
  },
  {
    name: "灰白",
    value: "text-slate-300",
    bg: "bg-slate-300",
  },
  {
    name: "金色",
    value: "text-amber-200",
    bg: "bg-amber-200",
  },
  {
    name: "黑色",
    value: "text-stone-950",
    bg: "bg-stone-950",
  },
];

const fontFamilyOptions = [
  {
    name: "黑体",
    value: "SimHei",
  },
  {
    name: "隶书",
    value: "NotoSansLisu",
  },
  {
    name: "CactusClassicalSerif",
    value: "CactusClassicalSerif",
  },
  {
    name: "NotoSansTC",
    value: "NotoSansTC",
  },
];

function transformTCOrSp(str: string, isTrandition: boolean) {
  return isTrandition ? tify(str) : sify(str);
}

const YueCard = ({ item }: { item: CorpusItem }) => {
  const searchParams = useSearchParams();
  const [fontColor, setFontColor] = useState(fontColorOptions[0].value);
  const [fontFamily, setFontFamily] = useState(fontFamilyOptions[0].value);
  const [bg, setBg] = useState(bgColorOptions[0].value);
  const [traditional, setTranditional] = useState(
    searchParams.get("lang") === "jian" ? false : true
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-around gap-4 items-start">
        <Select
          defaultValue={fontFamily}
          onValueChange={(value) => setFontFamily(value)}
        >
          <SelectTrigger className="w-34">
            <SelectValue placeholder="选择字体" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>字体</SelectLabel>
              {fontFamilyOptions.map((x) => (
                <SelectItem key={x.value} value={x.value}>
                  {x.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          defaultValue={fontColor}
          onValueChange={(value) => setFontColor(value)}
        >
          <SelectTrigger className="w-34">
            <SelectValue placeholder="选择字体颜色" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>字体颜色</SelectLabel>
              {fontColorOptions.map((x) => {
                return (
                  <SelectItem key={x.value} value={x.value}>
                    <span className={`h-4 w-4 rounded-xl ${x.bg}`}></span>{" "}
                    {x.name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select defaultValue={bg} onValueChange={(value) => setBg(value)}>
          <SelectTrigger className="w-34">
            <SelectValue placeholder="选择背景" id="select-bg-color" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>背景</SelectLabel>
              {bgColorOptions.map((x) => (
                <SelectItem key={x.value} value={x.value}>
                  <span className={`h-4 w-4 rounded-xl  ${x.value}`}></span>{" "}
                  {x.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2 w-34 pt-2">
          <Switch
            id="language-mode"
            checked={traditional}
            onCheckedChange={(value) => setTranditional(value)}
          />
          <Label htmlFor="language-mode">简体/繁体</Label>
        </div>
      </div>
      <CardContent
        bg={bg}
        fontColor={fontColor}
        fontFamily={fontFamily}
        item={item}
        transformTCOrSp={transformTCOrSp}
        traditional={traditional}
        isQrcode={false}
      />
      <div className="flex justify-end">
        <Post
          bg={bg}
          fontColor={fontColor}
          fontFamily={fontFamily}
          item={item}
          transformTCOrSp={transformTCOrSp}
          traditional={traditional}
          isQrcode={false}
        />
      </div>
    </div>
  );
};

export default YueCard;
