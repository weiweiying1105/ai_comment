export interface ICategory {
    id: number
    name: string
    parentId: number | null,
    children: ICategory[] | null
}