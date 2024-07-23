//Опции для модели
export enum TrackingModelParameter {
    Name = "Name",
    Color = "Color",
    AutoFill = "AutoFill",
    List = "List",
}

//Опции отслеживания
export const enum TrackingType {
    Check = "Check",
    Counter = "Counter",
    Note = "Note",
    DayTime = "DayTime",
}

// noinspection NonAsciiCharacters
export const TrackingTypeNameRU: { [key in TrackingType]: string } = {
    [TrackingType.Check]: "Чекбокс",
    [TrackingType.Counter]: "Счетчик",
    [TrackingType.Note]: "Заметка",
    [TrackingType.DayTime]: "Простое время",
};

export function GetTrackingTypeName(type: TrackingType): string {
    return TrackingTypeNameRU[type];
}

export const TrackingTypeItems: { value: TrackingType, label: string }[] = [
    {value: TrackingType.Check, label: GetTrackingTypeName(TrackingType.Check)},
    {value: TrackingType.Counter, label: GetTrackingTypeName(TrackingType.Counter)},
    {value: TrackingType.Note, label: GetTrackingTypeName(TrackingType.Note)},
    {value: TrackingType.DayTime, label: GetTrackingTypeName(TrackingType.DayTime)},
];
export const TrackTypeDefaultValue = TrackingTypeItems[0]


//Опции для параметра
export const enum TrackingOptionParameter {
    Name = "Name", //Название
    Type = "Type", //Тип взаимодействия
    DefaultValue = "DefaultValue", //Значение по умолчанию
    // Value = "Value", //Текущее значение
    AllowedValues = "AllowedValues", //Список доступных значений
    MinValue = "MinValue", //Минимальное значение
    MaxValue = "MaxValue", //Максимальное значение
    Step = "Step", //Шаг изменения значения
    Unit = "Unit", //Единица измерения
    MaxLength = "MaxLength",//Максимальная длина
    LabelPosition = "LabelPosition",
    LabelSize = "LabelSize",
    ElementSize = "ElementSize",
    Style = "Style",
    Id = "Id",
}

export interface OptionWithValue {
    option: TrackingOptionParameter,
    value: any
}

const CheckOptionTrackingDefault: OptionWithValue[] = [
    {option: TrackingOptionParameter.DefaultValue, value: false},
    {option: TrackingOptionParameter.Type, value: TrackingType.Check},
    {option: TrackingOptionParameter.Name, value: ""},
    {option: TrackingOptionParameter.LabelPosition, value: "l"},
    {option: TrackingOptionParameter.LabelSize, value: "sm"},
    {option: TrackingOptionParameter.ElementSize, value: "sm"},
    {option: TrackingOptionParameter.Style, value: "filled"},
];

const CounterOptionTrackingDefault: OptionWithValue[] = [
    {option: TrackingOptionParameter.DefaultValue, value: 0},
    {option: TrackingOptionParameter.MinValue, value: -100},
    {option: TrackingOptionParameter.MaxValue, value: 100},
    {option: TrackingOptionParameter.Step, value: 1},
    {option: TrackingOptionParameter.Type, value: TrackingType.Counter},
    {option: TrackingOptionParameter.Name, value: ""},
    {option: TrackingOptionParameter.LabelPosition, value: "l"},
    {option: TrackingOptionParameter.LabelSize, value: "sm"},
    {option: TrackingOptionParameter.ElementSize, value: "xs"},
    {option: TrackingOptionParameter.Style, value: "default"},
];
const NoteOptionTrackingDefault: OptionWithValue[] = [
    {option: TrackingOptionParameter.DefaultValue, value: ""},
    {option: TrackingOptionParameter.MaxLength, value: 1000},
    {option: TrackingOptionParameter.Type, value: TrackingType.Note},
    {option: TrackingOptionParameter.Name, value: ""},
    {option: TrackingOptionParameter.LabelPosition, value: "l"},
    {option: TrackingOptionParameter.LabelSize, value: "sm"},
    {option: TrackingOptionParameter.ElementSize, value: "sm"},
    {option: TrackingOptionParameter.Style, value: "default"},
];


const DayTimeOptionTrackingDefault: OptionWithValue[] = [
    {option: TrackingOptionParameter.DefaultValue, value: "00:00"},
    {option: TrackingOptionParameter.Type, value: TrackingType.DayTime},
    {option: TrackingOptionParameter.Name, value: ""},
    {option: TrackingOptionParameter.LabelPosition, value: "l"},
    {option: TrackingOptionParameter.LabelSize, value: "sm"},
    {option: TrackingOptionParameter.ElementSize, value: "sm"},
    {option: TrackingOptionParameter.Style, value: "default"},
];

//связь тип + параметры
export const TrackingTypeToOptionType: { [key in TrackingType]: OptionWithValue[] } = {
    Check: CheckOptionTrackingDefault,
    Counter: CounterOptionTrackingDefault,
    Note: NoteOptionTrackingDefault,
    DayTime: DayTimeOptionTrackingDefault,
};

export interface TrackViewModel {
    id: number
    groupId: any
    params: Map<TrackingModelParameter, any>
    viewOptions: Map<TrackingOptionParameter, any>[]
}

export interface TrackSerialisedModel {
    id: number,
    groupId: number | undefined,
    params: string,
    options: string
}

export interface ValuesModel {
    trackId: number,
    day: number,
    dayE: number,
    values: TrackValue[]
}


export interface TrackFillsModel {
    trackId: number,
    values: TrackFillModel[]
}

export interface TrackFillModel {
    day: number,
    dayE: number,
    values: TrackValue[]
}

export interface SetValueResponse {
    removeFrom: number,
    removeTo: number,
    add: TrackFillModel[]
}

export interface TrackValue {
    id: number,
    values: OptionValue[]
}

export interface OptionValue {
    id: number,
    value: any
}

export interface SaveStorageRequest {
    trackId: number,
    day: number,
    value: TrackValue[]
}

export interface StorageRecord {
    object: SaveStorageRequest,
    timeStamp: number,
}
