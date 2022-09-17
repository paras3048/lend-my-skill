import { Group, Image, Text, useMantineTheme } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { Dispatch, SetStateAction } from "react";
import { showNotification } from "@mantine/notifications";
export function DropzoneSingle({
  file,
  setFile,
  title,
}: {
  file: undefined | File;
  setFile: Dispatch<SetStateAction<File | undefined>>;
  title?: string;
}) {
  const theme = useMantineTheme();
  return (
    <Dropzone
      onDrop={(files) => setFile(files[0])}
      onReject={(files) =>
        showNotification({
          message: "Invalid File Selected",
          color: "red",
        })
      }
      maxSize={3 * 1024 ** 2}
      accept={{
        "image/*": [],
      }}
    >
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: 220, pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            size={50}
            stroke={1.5}
            color={
              theme.colors[theme.primaryColor][
                theme.colorScheme === "dark" ? 4 : 6
              ]
            }
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size={50}
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        {file === undefined ? (
          <Dropzone.Idle>
            <IconPhoto size={50} stroke={1.5} />
          </Dropzone.Idle>
        ) : null}

        <div>
          {file === undefined ? (
            <Text size="xl" inline>
              {title !== undefined
                ? title
                : "Drag image here or click to select file"}
            </Text>
          ) : (
            <Image src={URL.createObjectURL(file)} />
          )}
        </div>
      </Group>
    </Dropzone>
  );
}
