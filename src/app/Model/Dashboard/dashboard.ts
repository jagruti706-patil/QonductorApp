export class Dashboard {}

export class ARRespesentative {
  opentodaystaskcount: number;
  todaytotalar: string;
  openalltaskcount: number;
  alltotalar: string;
  openduetaskcount: number;
  highprioritytaskamt: string;
}

export class ManagerDashboard {
  workitems: number;
  totalar: string;
  agents: number;
  untouchworkitem: number;
  averageproductivitywork: number;
  pendingtask: number;
  closedar: string;
  openduetaskcount: number;
  highprioritytaskamt: string;
  negativeworkitem: number;
  bucket_1: string;
  bucket_2: string;
  bucket_3: string;
  bucket_4: string;
  bucket_5: string;
  bucket_6: string;
  bucket_7: string;
  bucket_1_claimcount: number;
  bucket_2_claimcount: number;
  bucket_3_claimcount: number;
  bucket_4_claimcount: number;
  bucket_5_claimcount: number;
  bucket_6_claimcount: number;
  bucket_7_claimcount: number;
  deferbucket_1: string;
  deferbucket_2: string;
  deferbucket_3: string;
  deferbucket_4: string;
  deferbucket_5: string;
  deferbucket_6: string;
  deferbucket_7: string;
  deferbucket_1_claimcount: number;
  deferbucket_2_claimcount: number;
  deferbucket_3_claimcount: number;
  deferbucket_4_claimcount: number;
  deferbucket_5_claimcount: number;
  deferbucket_6_claimcount: number;
  deferbucket_7_claimcount: number;
  arstatus: TopStatus[];
  araction: TopAction[];
  payerbyar: TopPayerByAR[];
  clientbyar: TopClientByAR[];
  deferworkitems: number;
  defertotalar: string;
  networkitems: number;
  nettotalar: string;
}

export class TopStatus {
  nclientid: number;
  statuscount: number;
  statusdescription: string;
}
export class TopAction {
  nclientid: number;
  actioncount: number;
  actiondescription: string;
}
export class TopPayerByAR {
  nclientid: number;
  payername: string;
  remainingbalance: string;
}
export class TopClientByAR {
  nclientid: number;
  sclientname: string;
  remainingbalance: string;
}
