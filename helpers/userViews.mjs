export const USERS = {
  adam: {
    name: 'Adam Calder',
    filters: {
      Owner: 'Adam Calder',
      Product: ['Nitecrawler', 'Travelpass']
    }
  },
  jeremy: {
    name: 'Jeremy Dowse',
    filters: {
      Owner: 'Jeremy Dowse',
      Product: ['Cable', 'RC', 'RD']
    }
  },
  lisa: {
    name: 'Lisa King',
    filters: {
      Role: 'Designer'
    }
  },
  jordan: {
    name: 'Jordan Lump',
    filters: {
      Role: 'Designer'
    }
  },
  mike: {
    name: 'Mike Baird - Head of Product',
    filters: {}
  },
  sara: {
    name: 'Sara Tapusoa',
    filters: {}
  }
};

export function buildUserFilter(user) {
  if (!user.filters || Object.keys(user.filters).length === 0) {
    return null;
  }
  
  const filters = [];

  if (user.filters.Owner) {
    filters.push({
      property: "Owner",
      people: {
        contains: user.filters.Owner
      }
    });
  }

  if (user.filters.Role) {
    filters.push({
      property: "Role",
      rich_text: {
        equals: user.filters.Role
      }
    });
  }

  if (user.filters.Product) {
    filters.push({
      or: user.filters.Product.map(product => ({
        property: "Product",
        multi_select: {
          contains: product
        }
      }))
    });
  }

  return filters.length > 1 ? { and: filters } : filters[0];
}