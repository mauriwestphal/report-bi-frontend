import { ReactNode } from "react";

export interface TopSearchProps {
  search?: {
    placeholder: string;
    onClick(search?: string): void;
  };
  action?: {
    buttonText: string;
    icon?: ReactNode;
    onClick(): void;
    disabled?: boolean;
  };
}
