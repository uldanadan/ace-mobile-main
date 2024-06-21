export class User {
  email: string;
  firstName: string;
  lastName: string;
  image: string | null;
  uuid: string;

  constructor({
    email,
    firstName,
    lastName,
    image,
    uuid
  }: {
    email: string;
    firstName: string;
    lastName: string;
    image: string | null;
    uuid: string;
  }) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.image = image;
    this.uuid = uuid;
  }

  static serialize({
    email,
    first_name: firstName,
    last_name: lastName,
    image,
    uuid
  }: {
    email: string;
    first_name: string;
    last_name: string;
    image: string | null;
    uuid: string;
  }) {
    return new User({
      email,
      firstName,
      lastName,
      image,
      uuid
    });
  }
}
