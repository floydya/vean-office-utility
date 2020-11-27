export const getApiURI = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://crm.vean-tattoo.com';
  }
  return 'http://localhost:8000';
};

export const buildURI = (url: string) => {
  return `${getApiURI()}${url}`;
};

export default { getApiURI };
