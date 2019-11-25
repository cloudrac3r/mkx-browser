/**
 * @typedef CupData
 * @property {string} name
 * @property {string} icon
 * @property {CourseData[]} courses
 */

/**
 * @typedef CourseData
 * @property {number} courseID
 * @property {string} customName
 * @property {number} customNameIsCanon
 * @property {string} name
 * @property {number} position
 * @property {TagData[]} tags
 */

/**
 * @typedef TagData
 * @property {number} tagID
 * @property {string} text
 */

module.exports = {}
/** @type {CupData[]} */
module.exports.cupMasterList = null
/** @type {TagData[]} */
module.exports.tagMasterList = null
