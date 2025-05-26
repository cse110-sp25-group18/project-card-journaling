export class CardModel {
  constructor(data = {}) {
    this._id = data.id || crypto.randomUUID();
    this._prompt = data.prompt || null;
    this._response = data.response || "";
    this._date = data.date ? new Date(data.date) : new Date();
    this._image = data.image || "";
    this._alt = data.alt || "Journal card image";
    this._isModified = false;
  }

  get id() {
    return this._id;
  }

  get prompt() {
    return this._prompt;
  }

  set prompt(value) {
    this._prompt = value;
    this._isModified = true;
  }

  get response() {
    return this._response;
  }

  set response(value) {
    this._response = value;
    this._isModified = true;
  }

  get date() {
    return this._date;
  }

  set date(value) {
    this._date = new Date(value);
    this._isModified = true;
  }

  get formattedDate() {
    return this._date.toLocaleDateString();
  }

  get isoDate() {
    return this._date.toISOString().split("T")[0];
  }

  get image() {
    return this._image;
  }

  set image(value) {
    this._image = value;
    this._isModified = true;
  }

  get alt() {
    return this._alt;
  }

  set alt(value) {
    this._alt = value;
    this._isModified = true;
  }

  get isModified() {
    return this._isModified;
  }

  //Reset the modified flag
  resetModified() {
    this._isModified = false;
  }

  //Convert model data to a plain object for storage
  toJSON() {
    return {
      id: this._id,
      prompt: this._prompt,
      response: this._response,
      date: this._date.toISOString(),
      image: this._image,
      alt: this._alt,
    };
  }

  //Create a CardModel from stored JSON data
  static fromJSON(json) {
    const data = typeof json === "string" ? JSON.parse(json) : json;
    return new CardModel(data);
  }
}
