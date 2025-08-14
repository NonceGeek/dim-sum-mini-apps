import { CardContentItem } from "@/types";
import { Button } from "./ui/button";
import CardContent from "./cardContent";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import domtoimage from "dom-to-image";
import { toast } from "sonner";

export default function Post({
  bg,
  fontColor,
  fontFamily,
  item,
  transformTCOrSp,
  traditional,
}: CardContentItem) {
  const [scale, setScale] = useState("normal");
  const [submitInfo, setSubmitInfo] = useState("下载");
  const cardRef = useRef<HTMLDivElement>(null);
  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      setSubmitInfo("下载中...");

      const dataUrl = await domtoimage.toPng(cardRef.current, {
        quality: 1.0,
        bgcolor: bg,
        style: {
          transform: "scale(1)",
          "transform-origin": "top left",
        },
      });

      const link = document.createElement("a");
      link.download = `yue-card-${item.data}.png`;
      link.href = dataUrl;
      setSubmitInfo("下载");
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
    }
  };
  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setScale("normal");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors">
          预览
        </Button>
      </DialogTrigger>
      <DialogTitle />
      <DialogContent className="rounded-none [&>button]:hidden max-h-[98vh] overflow-y-auto">
        <CardContent
          cardRef={cardRef}
          isQrcode={true}
          scale={scale}
          bg={bg}
          fontColor={fontColor}
          fontFamily={fontFamily}
          item={item}
          transformTCOrSp={transformTCOrSp}
          traditional={traditional}
        />
        <DialogFooter className="sm:justify-between flex-row flex-wrap">
          <div className="flex gap-3 justify-start ">
            <Label htmlFor="size-change">文字大小调整：</Label>
            <RadioGroup
              defaultValue="normal"
              className="grid grid-cols-3"
              id="size-change"
              onValueChange={(value) => setScale(value)}
            >
              <div className="flex items-center gap-1">
                <RadioGroupItem value="normal" id="r1" />
                <Label htmlFor="r1">正常</Label>
              </div>
              <div className="flex items-center gap-1">
                <RadioGroupItem value="large" id="r2" />
                <Label htmlFor="r2">大</Label>
              </div>
              <div className="flex items-center gap-1">
                <RadioGroupItem value="xl" id="r3" />
                <Label htmlFor="r3">特大</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex gap-2 ">
            <Button type="submit" onClick={handleDownload}>
              {submitInfo}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
