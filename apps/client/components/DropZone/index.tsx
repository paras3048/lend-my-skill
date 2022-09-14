import { Dispatch, SetStateAction, useState } from "react";
import { Text, Image, SimpleGrid } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";

export function DropZonePreview({
  files,
  setFiles,
  title,
}: {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  title?: string;
}) {
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
        onClick={() => {
          const f = structuredClone(files);
          f.splice(index, 1);
          setFiles(f);
        }}
      />
    );
  });

  return (
    <div>
      <Dropzone
        accept={[
          MIME_TYPES.png,
          MIME_TYPES.jpeg,
          MIME_TYPES.jpeg,
          MIME_TYPES.webp,
        ]}
        onDrop={(f) => setFiles((oldFiles) => [...oldFiles, ...f])}
      >
        <Text align="center">
          {title === undefined ? "Drop images here" : title}
        </Text>
      </Dropzone>

      <SimpleGrid
        cols={4}
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        mt={previews.length > 0 ? "xl" : 0}
      >
        {previews}
      </SimpleGrid>
    </div>
  );
}
