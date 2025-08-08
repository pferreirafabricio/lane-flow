import type { TimelineActivity } from "../../../modules/timeline/timeline.types";

export type TimelineItemProps = {
  item: TimelineActivity;
  minDate: string;
  currentZoom: number;
  isEditing?: boolean;
  handleEdit: (id: number) => void;
  handleEditSave: (id: number, newName: string) => void;
};
