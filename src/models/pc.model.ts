export class Pc {
  uuid: string;
  number: number;
  mapX: number;
  mapY: number;
  isBusy: boolean;
  currentSession?: {
    started_at: string;
    user: string;
  };
  currentReservation?: {
    started_at: string;
    user: string;
  };

  constructor({
    uuid,
    number,
    mapX,
    mapY,
    isBusy,
    currentSession,
    currentReservation,
  }: {
    uuid: string;
    number: number;
    mapX: number;
    mapY: number;
    isBusy: boolean;
    currentSession?: {
      started_at: string;
      user: string;
    };
    currentReservation?: {
      started_at: string;
      user: string;
    };
  }) {
    this.uuid = uuid;
    this.number = number;
    this.mapX = mapX;
    this.mapY = mapY;
    this.isBusy = isBusy;
    this.currentSession = currentSession;
    this.currentReservation = currentReservation;
  }

  static serialize({
    uuid,
    number,
    map_x: mapX,
    map_y: mapY,
    is_busy: isBusy,
    current_session: currentSession,
    current_reservation: currentReservation,
  }: {
    uuid: string;
    number: number;
    map_x: number;
    map_y: number;
    is_busy: boolean;
    current_session: {
      started_at: string;
      user: string;
    };
    current_reservation: {
      started_at: string;
      user: string;
    };
  }) {
    return new Pc({
      uuid,
      number,
      mapX,
      mapY,
      isBusy,
      currentSession,
      currentReservation,
    });
  }

  static serializeList(list: Array<any>) {
    return list ? list.map(Pc.serialize) : [];
  }
}
