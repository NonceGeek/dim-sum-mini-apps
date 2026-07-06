import { RefObject } from "react";

interface LyricLine {
  sec?: number;
  data?: string;
  pron?: string;
}

interface DictionaryContext {
  page?: number;
  number?: string;
  album?: string;
  audio?: string;
  others?: {
    異體?: any[];
    校訂註?: string | null;
  };
  pinyin?: string[];
  meaning?: string[];
  author?: string;
  composer?: string;
  lyricist?: string;
  song_name?: string;
  lyric?: string | LyricLine[];
  pron?: string;
  introduction?: string;
  song_name_pin?: string;
}
export interface DictionaryNote {
  context: DictionaryContext;
  contributor?: string;
}

export type Note = DictionaryNote;

interface StructuredNoteBlock {
  type?: string;
  category?: string;
  content?: string;
  value?: string | number;
  emotion?: string;
  intensity?: string | number;
  emotionIntensity?: string | number;
  emotion_intensity?: string | number;
  jyutping?: string;
  jytping?: string;
}

interface StructuredNoteDataItem {
  blocks?: StructuredNoteBlock[];
  jyutping?: string;
  jytping?: string;
  category?: string;
  emotion?: string;
  intensity?: string | number;
  emotionIntensity?: string | number;
  emotion_intensity?: string | number;
}

export interface StructuredNote {
  data?: StructuredNoteDataItem[];
}

export interface CorpusItem {
  id: string;
  unique_id: string;
  data: string;
  category: string;
  note: Note;
  structured_note?: StructuredNote;
  structuredNote?: StructuredNote;
  tags: string[];
  related_tags?: string[];
  recommended_tags?: string[];
}

export interface CorpusCategory {
  id?: string;
  name?: string;
  nickname?: string;
  tags?: string[];
  [key: string]: unknown;
}

export type CardMode = "light" | "dark";

export interface CardContentItem {
  cardRef?: RefObject<HTMLDivElement | null>;
  scale?: string;
  isQrcode: boolean;
  fontFamily: string;
  mode: CardMode;
  transformTCOrSp: (str: string, isTraditional: boolean) => string;
  traditional: boolean;
  item: CorpusItem;
  category: CorpusCategory | null;
}
