export default interface popoverInterface {
    CASEID: string;
    CREATEDBY1: string;
    CREATEDDATETIME1: string;
    CREATEDDATETIME2: string;
    STATUSTO: string;
    SUBSTATUSTO: string;
    SYNCSTARTDATETIME: string;
    RECID: number;
    OSPADRE: string;
    estado: string;
    projid: string;
    schedfromdate: string;
    workshop: string;
    city: string;
    region: string;
    tipo_servicio: string;
    grupo_servicio: string;
    description?: string;
    cause?: string;
    solution?: string;
    dateEnd?: string;
    symptoms?: string;
    sla_horas?: number;
    recuento?: number;
    tiene_repuesto?: boolean;
    GMCREATEDDATETIME?: string;
  }