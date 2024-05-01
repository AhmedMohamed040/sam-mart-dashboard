export interface IDriver {
    id: string
    warehouse_id: string
    latitude: number
    longitude: number
    is_receive_orders: boolean
    user: IUser
  }

  export interface IUser {
    id: string
    username: string
    email: string
    phone: string
    avatar: string
    birth_date: string
    gender: string
  }

    export interface Driver  {
      id: string
      warehouse_id: string
      latitude: any
      longitude: any
      is_receive_orders: boolean
      user: {
        id: string
        username: string
        email: any
        phone: string
        avatar: string
        birth_date: any
        gender: any
      }
    }

