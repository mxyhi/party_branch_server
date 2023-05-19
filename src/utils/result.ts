export interface ResType {
  /**
   * @description
   * ```js
   * 0: "success";
   * -1: "error";
   * 401: "timeout";
   * ```
   */
  code: 0 | -1 | 401;
  type: 'success' | 'error' | 'timeout';
  message: string;
  result: unknown;
}

export const codeToType = (code: ResType['code']) => {
  switch (code) {
    case 0:
      return 'success';
    case -1:
      return 'error';
    case 401:
      return 'timeout';
  }
};

export const res = (data: Omit<ResType, 'type'>) => ({
  type: codeToType(data.code),
  ...data,
});
