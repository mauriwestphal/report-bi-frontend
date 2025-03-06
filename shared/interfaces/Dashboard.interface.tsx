export default interface orderInterface {
  key: string;
  data: {
    nameOrder: string,
    numberOrder: string,
  };
  date: {
    dayIn: string,
    hoursIn: string
  }
  service: string;
  workshopDay: {
    workshopDays: number;
    workshopHours: string;
  };
  workshop: string;
  taller?: string;
  state: number;
  stateto: number;
  substateto: string;
  description: string;
  progressBar: {
    title: string;
    icon?: string;
    iconText: string;
    startText: string;
    bar: {
      label: string;
      progress: number;
      footerText: string;
      color: string;
    }
  }
  groupId: string;
  createdatetime: string;
  zone_city: string;
}

export default interface orderInterfaceUsuario {
  key: string;
  data: {
    nameOrder: string,
    numberOrder: string,
  };
  date: {
    dayIn: string,
    hoursIn: string
  }
  service: string;
  workshopDay: {
    workshopDays: number;
    workshopHours: string;
  };
  workshop: string;
  taller?: string;
  state: number;
  stateto: number;
  substateto: string;
  description: string;
  progressBar: {
    title: string;
    icon?: string;
    iconText: string;
    startText: string;
    bar: {
      label: string;
      progress: number;
      footerText: string;
      color: string;
    }
  }
  groupId: string;
  createdatetime: string;
  orderFather: string;
  logs?: Array<any>;
  zone_city: string;
}

