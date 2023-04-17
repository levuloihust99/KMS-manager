import { Mongo } from 'meteor/mongo';

export const Records = new Mongo.Collection('records');
export const RecordCount = new Mongo.Collection('count')
