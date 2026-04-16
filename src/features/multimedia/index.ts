export { MultimediaPage } from "./components/multimedia-page";
export { MultimediaDetailPage } from "./components/multimedia-detail-page";
export {
  getMediaBySlug,
  getMediaRelatedBooks,
  getRelatedMedia,
  parseMultimediaListQueryFromObject,
  parseMultimediaListQueryFromSearchParams,
  searchMultimedia,
} from "./server/multimedia-adapter";
export { getMultimediaPageData } from "./server/get-multimedia-page-data";
export { getMultimediaDetailPageData } from "./server/get-multimedia-detail-page-data";
