import { ReactNode } from "react";

export interface CardInfoProps {
  bordered?: boolean;
  title: string | ReactNode;
  icon: ReactNode;
  body: string | ReactNode;
  footerConfig?: {
    width?: string;
  };
  url: string;
  icono?: boolean
}
