export class GameCenter {
  uuid: string;
  name: string;
  image: string;
  rating: number;
  address: string;
  latitude: number;
  longitude: number;
  rateFrom: number;
  schedule: string;
  isAvailable: boolean;
  classLevel: number;
  appDeeplink: string;
  zones: Array<any>;

  constructor({ uuid, name, image, rating, address, latitude, longitude, rateFrom, schedule, isAvailable, classLevel, appDeeplink, zones }: { uuid: string; name: string; image: string; rating: number; address: string; latitude: number; longitude: number; rateFrom: number; schedule: string; isAvailable: boolean; classLevel: number; appDeeplink: string; zones: Array<any> }) {
    this.uuid = uuid;
    this.name = name;
    this.image = image;
    this.rating = rating;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.rateFrom = rateFrom;
    this.schedule = schedule;
    this.isAvailable = isAvailable;
    this.classLevel = classLevel;
    this.appDeeplink = appDeeplink;
    this.zones = zones;
  }

  static serialize({ uuid, name, image, rating, address, latitude, longitude, rate_from: rateFrom, schedule, is_available: isAvailable, class_level: classLevel, app_deeplink: appDeeplink, zones }: { uuid: string; name: string; image: string; rating: number; address: string; latitude: number; longitude: number; rate_from: number; schedule: string; is_available: boolean; class_level: number; app_deeplink: string; zones: Array<any> }) {
    return new GameCenter({
      uuid,
      name,
      image,
      rating,
      address,
      latitude,
      longitude,
      rateFrom,
      schedule,
      isAvailable,
      classLevel,
      appDeeplink,
      zones,
    });
  }

  static serializeList(list: Array<any>) {
    return list ? list.map(GameCenter.serialize) : [];
  }
}

export class GameCenterRate {
  startedAt: string;
  endedAt: string;
  price: number;

  constructor({ startedAt, endedAt, price }: { startedAt: string; endedAt: string; price: number }) {
    this.startedAt = startedAt;
    this.endedAt = endedAt;
    this.price = price;
  }

  static serialize({ started_at: startedAt, ended_at: endedAt, price }: { started_at: string; ended_at: string; price: number }) {
    return new GameCenterRate({
      startedAt,
      endedAt,
      price,
    });
  }

  static serializeList(list: Array<any>) {
    return list ? list.map(GameCenterRate.serialize) : [];
  }
}
