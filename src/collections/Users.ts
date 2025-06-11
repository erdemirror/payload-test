// collections/Users.ts
import { CollectionConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // enables local authentication
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    // Add other profile fields here
  ],
}

export default Users
