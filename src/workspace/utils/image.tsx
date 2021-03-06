import * as React from "react";
import {Image, View} from "react-native"
import { filters } from "../types/filters/helpers/filters";
import { FilterId } from "../types/filters";
import Conf from "../../../ode-framework-conf";
import { Icon } from "../../ui";
import { CommonStyles } from "../../styles/common/styles";
import {DEVICE_HEIGHT, DEVICE_WIDTH, layoutSize} from "../../styles/common/layoutSize";
import { signUrl } from "../../infra/oauth";
import {IFile} from "../types";
import FastImage from "react-native-fast-image";
import ImageOptional from "../../ui/ImageOptional";

export const renderIcon = ( id: string | null, isFolder: boolean, name: string, contentType: string | undefined): any => {
  const icon = getIcon(id, isFolder, name, contentType);

  if (icon)
    return (
      <Icon color={CommonStyles.grey} size={layoutSize.LAYOUT_50} name={icon}/>
    );
  else {
    // @ts-ignore
    const uri = `${Conf.currentPlatform.url}/workspace/document/${id}?thumbnail=120x120`;
    const style = {width: layoutSize.LAYOUT_50, height: layoutSize.LAYOUT_50};
    return (
        // resizeRatio === contain by default
        <ImageOptional
            style={style}
            imageComponent={Image}
            errorComponent={<UnavailableIcon/>}
            source={signUrl(uri)}
        />
    )
  }
};

export const renderImage = ( item: IFile, isFolder: boolean, name: string): any => {
  const icon = getIcon(item.id, isFolder, name, item.contentType);
  const uri = `${Conf.currentPlatform.url}/workspace/document/${item.id}`;

  if (icon)
    return (
      <View style={{ width: width(), height: height(), justifyContent: 'center', alignItems: 'center'}}>
        <Icon color={CommonStyles.grey} size={layoutSize.LAYOUT_200} name={icon}/>
      </View>
    );
  return (
      <ImageOptional
          style={{ width: width(), height: height()}}
          imageComponent={Image}
          errorComponent={<UnavailableImage />}
          resizeMode={FastImage.resizeMode.contain}
          source={signUrl(uri)}
      />
  )
};

const getIcon = ( id: string | null, isFolder: boolean, pName: string | null, contentType: string | undefined): string | null => {

  if (isFolder) {
    switch (filters(id)) {
      case FilterId.owner:
        return "folder11";
      case FilterId.shared:
        return "shared_files";
      case FilterId.protected:
        return "added_files";
      case FilterId.trash:
        return "deleted_files";
      default:
        return "folder11"
    }
  }

  if (contentType) {
    if (contentType.startsWith("audio"))
      return "file-audio";
    if (contentType.startsWith("video"))
      return "file-video-outline";
    if (contentType.startsWith("image"))
      return null;
    if (contentType.startsWith("application/pdf"))
      return "pdf_files";
  }

  if (!pName)
    return "file-document-outline";

  const name = pName.toLowerCase();

  if (name.endsWith(".pdf"))
    return "pdf_files";
  if (name.endsWith(".doc") || name.endsWith(".docx") || name.endsWith(".dot") || name.endsWith(".dotm") || name.endsWith(".dotx") || name.endsWith(".docm"))
    return "file-word";
  if (name.endsWith(".ppt") || name.endsWith(".pptx") || name.endsWith(".pps"))
    return "file-powerpoint";
  if (name.endsWith(".xls") || name.endsWith(".xlsx") || name.endsWith(".xlsm") || name.endsWith(".xltm"))
    return "file-excel";
  if (name.endsWith(".svg"))
    return "file-document-outline";
  if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".bmp") || name.endsWith(".tiff"))
    return null;
  if (name.endsWith(".avi") || name.endsWith(".mp4") || name.endsWith(".ogg"))
    return "file-video-outline";
  if (name.endsWith(".zip") || name.endsWith(".7z") || name.endsWith(".gz") || name.endsWith(".tgz"))
    return "file-archive";
  return "file-document-outline"
};

const UnavailableImage = () => (
  <View style={{ width: width(), height: height(), justifyContent: 'center', alignItems: 'center'}}>
    <Icon color={CommonStyles.missingGrey} size={layoutSize.LAYOUT_200} name={'picture'}/>
  </View>
);

const UnavailableIcon = () => (
  <Icon color={CommonStyles.missingGrey} size={layoutSize.LAYOUT_46} name={'picture'}/>
);

const height = () => {
  return DEVICE_HEIGHT() - layoutSize.LAYOUT_160
};

const width = () => {
  return DEVICE_WIDTH()
};
