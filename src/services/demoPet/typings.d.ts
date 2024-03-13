declare namespace API {
  type Category = {
    /** 分组ID编号 */
    id?: number;
    /** 分组名称 */
    name?: string;
  };

  type deletePetPetIdParams = {
    /** Pet id to delete */
    petId: string;
  };

  type getMemberShopsParams = {
    key_word?: string;
  };

  type getPetFindByStatusParams = {
    /** Status values that need to be considered for filter */
    status: string;
  };

  type getPetPetIdParams = {
    /** 宠物 ID */
    petId: string;
  };

  type Pet = {
    /** 宠物ID编号 */
    id: number;
    /** 分组 */
    category: Category;
    /** 名称 */
    name: string;
    /** 照片URL */
    photoUrls: string[];
    /** 标签 */
    tags: Tag[];
    /** 宠物销售状态 */
    status: "available" | "pending" | "sold";
  };

  type Tag = {
    /** 标签ID编号 */
    id?: number;
    /** 标签名称 */
    name?: string;
  };
}
