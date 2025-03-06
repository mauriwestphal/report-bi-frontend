import React from "react";
import { notification } from "antd";

type NotificationType = 'success' | 'info' | 'warning' | 'error';


export const useNotification = () => {
    const [api, contextHolder] = notification.useNotification();

   const openNotification = (type: NotificationType, text: string) => {api[type]({
        message: (<div style={{ color: 'black' }}>
            {text}</div>),
        closeIcon: false,
        style: {
            background: 'white',
            color: 'black'
        }
    })}

    return {openNotification, contextHolder };
}




