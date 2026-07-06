import { CardContentItem, DictionaryNote } from "@/types";
import clsx from "clsx";
import QRCode from "react-qr-code";
import { Separator } from "./ui/separator";

function formatUniqueId(uniqueId: string) {
  if (uniqueId.length <= 12) return uniqueId;

  return `${uniqueId.slice(0, 7)}...${uniqueId.slice(-4)}`;
}

const structuredBlockLabels: Record<string, string> = {
  definition: "釋義",
  introduction: "介绍",
  emotion: "情感",
  intensity: "情感强度",
  other: "其他",
};

function addStructuredBlock(
  blocks: Record<string, string[]>,
  type: string | undefined,
  value: string | number | undefined,
) {
  if (!type || value === undefined || value === "") {
    return blocks;
  }

  blocks[type] = [...(blocks[type] || []), String(value)];
  return blocks;
}

export default function CardContent({
  cardRef,
  fontFamily,
  item,
  transformTCOrSp,
  traditional,
  scale = "normal",
  isQrcode = false,
  category,
}: CardContentItem) {
  const dictionaryContext = (item.note as DictionaryNote).context;
  const structuredNote = item.structured_note || item.structuredNote;
  const structuredPronunciations =
    structuredNote?.data
      ?.map((data) => {
        const blocksByType =
          data.blocks?.reduce<Record<string, string[]>>((blocks, block) => {
            if (block.type === "emotion") {
              addStructuredBlock(
                blocks,
                "emotion",
                block.category ?? block.content ?? block.value ?? block.emotion,
              );
              addStructuredBlock(blocks, "intensity", block.intensity);
              return blocks;
            }

            return addStructuredBlock(
              blocks,
              block.type,
              block.content ??
                block.value ??
                block.emotion ??
                block.emotionIntensity ??
                block.emotion_intensity ??
                block.intensity,
            );
          }, {}) || {};
        addStructuredBlock(blocksByType, "emotion", data.emotion);
        addStructuredBlock(
          blocksByType,
          "emotionIntensity",
          data.emotionIntensity ?? data.emotion_intensity ?? data.intensity,
        );

        return {
          jyutping: data.jyutping || data.jytping || "",
          blocksByType,
        };
      })
      .filter(
        (data) => data.jyutping || Object.keys(data.blocksByType).length > 0,
      ) || [];
  const hasStructuredContent = structuredPronunciations.length > 0;
  const contextPinyin = dictionaryContext.pinyin;
  const contextMeanings = dictionaryContext.meaning;
  const jyutpings = Array.isArray(contextPinyin)
    ? contextPinyin
    : contextPinyin
      ? [contextPinyin]
      : [];
  const definitions = Array.isArray(contextMeanings)
    ? contextMeanings
    : contextMeanings
      ? [contextMeanings]
      : [];
  const fallbackJyutpings = dictionaryContext.song_name_pin
    ? [dictionaryContext.song_name_pin]
    : jyutpings;
  return (
    <div
      ref={cardRef}
      className={clsx(
        "flex w-[min(92vw,960px)] max-w-full min-h-[320px] md:min-h-[360px] flex-col p-6 rounded-lg border shadow-[var(--ds-card-shadow)]",
        "border-[var(--ds-border)] bg-[var(--ds-background)] text-[var(--ds-foreground)]",
      )}
    >
      <div className="flex flex-1 flex-col space-y-4">
        <h1
          className={clsx(
            {
              "text-6xl": scale === "normal",
              "text-7xl": scale === "large",
              "text-8xl": scale === "xl",
            },
            `mt-2 font-semibold p-4 leading-tight font-[${fontFamily}]`,
          )}
        >
          {transformTCOrSp(item.data, traditional)}
        </h1>
        <div
          className={clsx(
            {
              "text-xs": scale === "normal",
              "text-base": scale === "large",
              "text-xl": scale === "xl",
            },
            `p-4 pt-0 font-[${fontFamily}] [&>*:not(:last-child)]:mb-3`,
          )}
        >
          {/* 结构化粤拼和释义，多音字按读音分组 */}
          {hasStructuredContent && (
            <div className="space-y-2 leading-relaxed">
              {structuredPronunciations.map((pronunciation, index) => (
                <div key={`${pronunciation.jyutping}-${index}`}>
                  {pronunciation.jyutping && (
                    <p>
                      <b>{transformTCOrSp("粵拼", traditional)}：</b>{" "}
                      <span>
                        {transformTCOrSp(pronunciation.jyutping, traditional)}
                      </span>
                    </p>
                  )}
                  {Object.entries(structuredBlockLabels).map(
                    ([type, label]) => {
                      const contents = pronunciation.blocksByType[type] || [];

                      if (contents.length === 0) {
                        return null;
                      }

                      return (
                        <p key={type}>
                          <b>{transformTCOrSp(label, traditional)}：</b>{" "}
                          <span>
                            {contents
                              .map((content) =>
                                transformTCOrSp(content, traditional),
                              )
                              .join("\n")}
                          </span>
                        </p>
                      );
                    },
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 粤拼 */}
          {!hasStructuredContent && fallbackJyutpings.length > 0 && (
            <p className="leading-relaxed">
              <b>{transformTCOrSp("粵拼", traditional)}：</b>{" "}
              <span>
                {fallbackJyutpings
                  .map((jyutping) => transformTCOrSp(jyutping, traditional))
                  .join("、 ")}
              </span>
            </p>
          )}

          {/* 释义 */}
          {!hasStructuredContent && definitions.length > 0 && (
            <p className="leading-relaxed">
              <b>{transformTCOrSp("釋義", traditional)}：</b>{" "}
              <span>
                {definitions
                  .map((definition) =>
                    transformTCOrSp(definition, traditional),
                  )
                  .join("\n")}
              </span>
            </p>
          )}

          {/* 歌曲歌手 */}
          {!hasStructuredContent && dictionaryContext.author && (
            <p className="leading-relaxed">
              <b>{transformTCOrSp("歌手", traditional)}：</b>{" "}
              <span>{dictionaryContext.author}</span>
            </p>
          )}

          {/* 歌曲介绍 */}
          {!hasStructuredContent && dictionaryContext.introduction && (
            <p className="leading-relaxed">
              <b>{transformTCOrSp("介绍", traditional)}：</b>{" "}
              <span>
                {transformTCOrSp(
                  dictionaryContext.introduction + "",
                  traditional,
                )}
              </span>
            </p>
          )}

          <Separator className="!my-4 bg-[var(--ds-primary)]" />

          {/* 来源语料集 */}
          {category?.nickname && (
            <p className="leading-relaxed">
              <b>{transformTCOrSp("来源语料集", traditional)}：</b>{" "}
              <span>{transformTCOrSp(category.nickname, traditional)}</span>
            </p>
          )}

          {/* 分类 */}
          {category?.tags && (
            <p className="leading-relaxed">
              <b>{transformTCOrSp("分类", traditional)}：</b>{" "}
              <span>
                {transformTCOrSp(category.tags.join("/"), traditional)}
              </span>
            </p>
          )}

          {/* 关键标签 */}
          {(item.tags.length > 0 || (item.related_tags?.length ?? 0) > 0) && (
            <div className="flex items-start gap-2 leading-relaxed">
              <b className="shrink-0">
                {transformTCOrSp("关键标签", traditional)}：
              </b>
              <div className="flex flex-wrap gap-2">
                {(item.tags.length > 0
                  ? item.tags
                  : item.related_tags?.length
                    ? item.related_tags
                    : []
                ).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md border border-[var(--ds-tag-border)] bg-[var(--ds-tag-background)] px-2 py-0.5 text-[0.95em] font-semibold leading-tight text-[var(--ds-tag-foreground)]"
                  >
                    {transformTCOrSp(tag, traditional)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 推荐标签 */}
          {(item.recommended_tags?.length ?? 0) > 0 && (
            <div className="flex items-start gap-2 leading-relaxed">
              <b className="shrink-0">
                {transformTCOrSp("推荐标签", traditional)}：
              </b>
              <div className="flex flex-wrap gap-x-2 gap-y-2">
                {(item.recommended_tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md border border-[#cfd3d7] bg-[#f1f3f5] px-2 py-0.5 text-[0.95em] font-semibold leading-tight text-[#7a7f85] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:border-[#2c333d] dark:bg-[#20252c] dark:text-[#b8bdc4] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                  >
                    {transformTCOrSp(tag, traditional)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(item.note as DictionaryNote).contributor && (
            <p className="leading-relaxed">
              <b>{transformTCOrSp("貢獻者", traditional)}：</b>{" "}
              <span>{(item.note as DictionaryNote).contributor}</span>
            </p>
          )}

          {item.unique_id && (
            <p className="leading-relaxed text-[var(--ds-muted)]">
              <span>Unique ID:</span>{" "}
              <span className="font-light">
                {formatUniqueId(item.unique_id)}
              </span>
            </p>
          )}
        </div>
      </div>
      {isQrcode && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--ds-border)] pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <img
              src="/logo.png"
              alt="DimSum"
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 object-contain"
            />
            <div className="flex min-w-0 items-baseline gap-2">
              <span className="shrink-0 text-base font-bold text-[var(--ds-foreground)]">
                DimSum
              </span>
            </div>
          </div>
          <div className="shrink-0 rounded-sm bg-white p-0.5">
            <QRCode
              value="https://search.aidimsum.com"
              size={44}
              bgColor="white"
              fgColor="black"
            />
          </div>
        </div>
      )}
    </div>
  );
}
