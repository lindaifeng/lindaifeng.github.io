---
title: Page手动分页工具类
---
```java
/**
 * @Author：清峰
 * @Description： List集合分页工具类
 */
public class PageListUtils {
    /**
     * 分页函数
     *
     * @param currentPage 当前页数
     * @param pageSize    每一页的数据条数
     * @param list        要进行分页的数据列表
     * @return 当前页要展示的数据
     */
    public static Page<?> getPages(Integer currentPage, Integer pageSize, List list) {
        Page page = new Page();
        int size = CollUtil.isNotEmpty(list) ? list.size() : 0;

        if (pageSize > size) {
            pageSize = size;
        }

        // 求出最大页数，防止currentPage越界
        if (pageSize > 0) {
            int maxPage = size % pageSize == 0 ? size / pageSize : size / pageSize + 1;

            if (currentPage > maxPage) {
                currentPage = maxPage;
            }
        }
        // 当前页第一条数据的下标
        int curIdx = currentPage > 1 ? (currentPage - 1) * pageSize : 0;

        List pageList = new ArrayList();

        // 将当前页的数据放进pageList
        for (int i = 0; i < pageSize && curIdx + i < size; i++) {
            pageList.add(list.get(curIdx + i));
        }

        page.setCurrent(currentPage).setSize(pageSize).setTotal(size).setRecords(pageList);
        return page;
    }
}
```

