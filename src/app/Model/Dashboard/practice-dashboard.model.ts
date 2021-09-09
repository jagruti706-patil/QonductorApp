export class PracticeDashboard {
  result: any[];
  userwiseresult: PracticeDashboardCards;
}
export class PracticeDashboardCards {
  groupassigned: number = 0;
  individualassigned: number = 0;
  inprocess: number = 0;
  new: number = 0;
  todaysassigned: number = 0;
  totalencounters: number = 0;
  totalindividualassigned: number = 0;
}
export class PracticeWiseEncounterCount {
  pending: number = 0;
  individualassigned: number = 0;
  inprocess: number = 0;
  newstatus: number = 0;
  todaysassigned: number = 0;
  totalencounters: number = 0;
  practicecompleted: number = 0;
}
