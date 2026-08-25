var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/js/modules/TagInfoData/TagDataClasses.ts
var TagDataClasses_exports = {};
__export(TagDataClasses_exports, {
  BaseDocsEntry: () => BaseDocsEntry,
  BaseTagNameableEntry: () => BaseTagNameableEntry,
  TagDataClassesHelper: () => TagDataClassesHelper,
  TagDataRoot: () => TagDataRoot,
  TagGroupEntry: () => TagGroupEntry,
  TagLabel: () => TagLabel,
  TagTokenEntry: () => TagTokenEntry
});
var TagDataRoot = class {
  constructor() {
    /**
     * Entries about the "tokens" or "scopes"
     * e.g. "heartbeatInternal"
     */
    __publicField(this, "TagTokens", []);
    /**
     * e.g. LuaBridge
     */
    __publicField(this, "TagGroups", []);
    /**
     * Let's define labels somewhere so we can re-use them
     * This is in case the same label is present on another tag. 
     */
    __publicField(this, "TagLabelDefs", []);
  }
};
var BaseDocsEntry = class {
  constructor(data) {
    __publicField(this, "Data");
    this.Data = data;
  }
  /**
   * Alternative function
   */
  static fromJSON(data) {
    let newClass = new this(data);
    return newClass;
  }
  //static readonly _typeSymbol?: symbol
  getDocsInfo() {
    if (this.Data.DocsInfo === void 0)
      this.Data.DocsInfo = {};
    return this.Data.DocsInfo;
  }
  /**
   * Sets the description.
   * Can be Raw HTML as well
   */
  SetDescription(str) {
    this.getDocsInfo().Description = str;
    return this;
  }
  /**
   * Assigns a search tag
   */
  InsertSearchTag(input) {
    var _a;
    ((_a = this.Data).Tags ?? (_a.Tags = [])).push(input);
    return this;
  }
  toJSON() {
    return JSON.stringify(this.Data);
  }
  /**
   * 
   * @deprecated
   */
  /*public InsertTo(builder: TagDataBuilder) {
      let table = builder.GetGenericTableForTag(this)
      if (table)
          table.push(this as any)
      
      return this;
  }*/
};
var BaseTagNameableEntry = class extends BaseDocsEntry {
  /**
   * Constructor
   * @param input Takes in a name as string or direct data.
   */
  constructor(input) {
    if (typeof input === "string") {
      super({
        NameUID: input
      });
    } else {
      super(input);
    }
  }
  /*constructor(input: string | T, callbackFunc: ((input: string) => T) | undefined) {
          if (typeof(input) === "string") {
              // A default fallback
              if (callbackFunc === undefined) {
                  callbackFunc = function(strInput) {
                      return {NameUID: strInput} as T
                  }
              }
  
              super(callbackFunc(input));
          } else {
              // Construct with direct data.
              super(input);
          }
      }*/
  SetNameUID(name) {
    this.Data.NameUID = name;
    return this;
  }
  /**
   * Set the color.
   */
  WithColor(colorArr) {
    this.Data.Color = colorArr;
    return this;
  }
  /**
   * Set DisplayName
   */
  WithDisplayName(str) {
    this.Data.DisplayNameRaw = str;
    return this;
  }
  /**
   * To inherit descriptions from
   */
  AsAliasOf(str) {
    this.Data.AliasOfNameUID = str;
    return this;
  }
};
var TagTokenEntry = class extends BaseTagNameableEntry {
  constructor() {
    super(...arguments);
    __publicField(this, "__brand");
  }
  // these are here to help with nominal typing
  //public static readonly _typeSymbol = Symbol("TagTokenEntry")
  /*constructor(input: string | ITagTokenEntry) {
      super(input, strInput => ({
          NameUID: strInput
      }))
  }*/
  /**
   * Assigns the token a "group category"
   * @param groupInput GroupUID or TagGroupEntry
   */
  WithGroup(groupInput) {
    if (typeof groupInput == "string") {
      this.Data.GroupUID = groupInput;
    } else if (groupInput instanceof TagGroupEntry) {
      this.Data.GroupUID = groupInput.Data.NameUID;
    }
    return this;
  }
};
var TagGroupEntry = class extends BaseTagNameableEntry {
  constructor() {
    super(...arguments);
    __publicField(this, "__brand");
  }
  //public static readonly _typeSymbol = Symbol("TagGroupEntry")
};
var TagLabel = class extends BaseTagNameableEntry {
  constructor() {
    super(...arguments);
    __publicField(this, "__brand");
  }
  //public static readonly _typeSymbol = Symbol("TagLabel")
};
var TagDataClassesHelper = class {
  static GetGenericSymbol(input) {
    if (input instanceof TagTokenEntry)
      return "TagTokenEntry";
    else if (input instanceof TagGroupEntry)
      return "TagGroupEntry";
    else if (input instanceof TagLabel)
      return "TagLabel";
    else
      throw "Not valid.";
  }
};

// src/js/modules/TagInfoData/TagDataBuilder.ts
var TagDataBuilder = class _TagDataBuilder {
  /**
   * Use static fromJSON to create from JSON.
   */
  constructor() {
    /** Root of the data */
    __publicField(this, "rootData", new TagDataRoot());
    __publicField(this, "_EntryMapping", {
      /*[TagTokenEntry._typeSymbol]: this.rootData.TagTokens,
      [TagGroupEntry._typeSymbol]: this.rootData.TagGroups,
      [TagLabel._typeSymbol]: this.rootData.TagLabelDefs,*/
      ["TagTokenEntry"]: this.rootData.TagTokens,
      ["TagGroupEntry"]: this.rootData.TagGroups,
      ["TagLabel"]: this.rootData.TagLabelDefs
    });
  }
  /**
   * @param data Can take existing data as well.
   */
  /*constructor(data?: TagDataRoot) {
      if (data) {
          this.rootData = data;
      }
  }*/
  /**
   * Construct from JSON
   * @param input The JSON input
   */
  static fromJSON(input) {
    let newBuilder = new _TagDataBuilder();
    for (let tagData of input.TagTokens) {
      newBuilder.AddTagToken(new TagTokenEntry(tagData));
    }
    for (let tagData of input.TagGroups) {
      newBuilder.AddTagGroup(new TagGroupEntry(tagData));
    }
    for (let tagData of input.TagLabelDefs) {
      newBuilder.AddTagLabel(new TagLabel(tagData));
    }
    return newBuilder;
  }
  AddTagToken(tagToken) {
    this._EntryMapping["TagTokenEntry"].push(tagToken);
    return this;
  }
  AddTagGroup(tagGroup) {
    this._EntryMapping["TagGroupEntry"].push(tagGroup);
    return this;
  }
  AddTagLabel(tagLabel) {
    this._EntryMapping["TagLabel"].push(tagLabel);
    return this;
  }
  AddTagEntryGeneric(entry) {
    let table = this.GetGenericTableForTag(entry);
    if (table)
      table.push(entry);
    else
      throw "Invalid entry.";
    return this;
  }
  GetGenericTableForTag(entry) {
    let result = this._EntryMapping[TagDataClassesHelper.GetGenericSymbol(entry)];
    if (result === void 0)
      throw "This type does not have a data storage.";
    return result;
  }
  /**
   * Generic adding
   * Although this is a problem.
   * @param entries 
   * @deprecated
   */
  AddGenericTagEntries(entries) {
    for (let entry of entries) {
      if (entry instanceof TagTokenEntry)
        this.AddTagToken(entry);
      else if (entry instanceof TagGroupEntry)
        this.AddTagGroup(entry);
      else if (entry instanceof TagLabel)
        this.AddTagLabel(entry);
    }
    return this;
  }
  /*public AddTagTokens = this.AddGenericTagEntries
  public AddTagGroups = this.AddGenericTagEntries
  public AddTagLabels = this.AddGenericTagEntries*/
  /**
   * After the entire data is setup
   * This here can process data and expand data.
   * Post-processing
   */
  Finalize() {
    return this;
  }
  /**
   * Convert our builder stored data into JSON
   * Don't forget to run Finalize before exporting
   */
  toJSON() {
    return JSON.stringify(this.rootData);
  }
};
export {
  TagDataBuilder,
  TagDataClasses_exports as TagDataClasses
};
