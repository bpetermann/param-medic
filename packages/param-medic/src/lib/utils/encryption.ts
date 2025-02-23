export const encrypt = (data: string, key: string): string => {
  return btoa(
    data
      .split('')
      .map((char, i) =>
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
      )
      .join('')
  );
};

export const decrypt = (encryptedData: string, key: string): string => {
  const decoded = atob(encryptedData);
  return decoded
    .split('')
    .map((char, i) =>
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    )
    .join('');
};
