import { Mongo } from 'meteor/mongo';

export const QARecords = new Mongo.Collection('qaRecords');
export const QARecordCount = new Mongo.Collection('qaCount')
export const CorpusRecords = new Mongo.Collection('corpusRecords')
export const CorpusRecordCount = new Mongo.Collection('corpusCount')
export const Pages = new Mongo.Collection('pages')