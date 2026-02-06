import { useState } from "react";

import { Icon } from "@/components/ui/icon";
import ImageHolder from "@/components/common/ImageHolder";
import TableFooter from "@/components/common/TableFooter";
import useAsyncData from "@/hooks/useAsyncData";
import imageService from "@/utils/services/imageService";

const { fetchPendingImageMetadata, reject, approve } = imageService();

type ImageReviewProps = {
  id: string;
  title: string;
};

const ImageReview: React.FC<ImageReviewProps> = ({ id, title }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const { data = [], loading } = useAsyncData(
    () => fetchPendingImageMetadata(),
    [],
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((item) => item.id));
    }
  };

  const toggleSelectItem = (itemId: string) => {
    setSelectedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleBulk = (action: "accept" | "discard") => {};

  return (
    <section
      id={id}
      className="bg-white rounded-2xl shadow-card border overflow-hidden scroll-mt-24"
    >
      <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Icon name="image" weight={500} className="text-primary text-2xl" />
          <h3 className="text-base font-bold text-text-primary font-display">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-tight bg-amber-100 text-amber-700 rounded-sm border border-amber-200 px-2.5 py-1">
            {data.length} Pending
          </span>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-orange-50/50 border-b border-slate-100 px-8 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="text-xs font-semibold text-primary">
            {selectedIds.length} items selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulk("accept")}
              className="btn-outline-primary"
            >
              <span className="material-symbols-outlined text-sm">
                done_all
              </span>
              Accept Selected
            </button>
            <button
              onClick={() => handleBulk("discard")}
              className="btn-subtle-grey"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Discard Selected
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="text-xs w-12 text-center px-6 py-4">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary focus:ring-primary/20"
                  checked={
                    data.length > 0 && selectedIds.length === data.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="text-xs px-6 py-4">Image</th>
              <th className="text-xs px-6 py-4">Gene</th>
              <th className="text-xs px-6 py-4">Date</th>
              <th className="text-xs text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item.id}
                  className={`${selectedIds.includes(item.id) ? "bg-orange-50/20" : "hover:bg-slate-50/30"} transition-colors`}
                >
                  <td className="px-6 py-5 text-center align-top pt-6">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-primary focus:ring-primary/20"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                    />
                  </td>

                  <td className="px-6 py-5">
                    <ImageHolder
                      imageId={item.id}
                      status={item.status}
                      height={150}
                    />
                  </td>
                  <td className="px-6 py-5 font-medium text-slate-900">
                    {item.geneId}
                  </td>
                  <td className="px-6 py-5">{item.submissionDate}</td>

                  <td className="px-6 py-5 text-right align-top pt-6">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {}}
                        className="btn-outline-primary"
                        title="Accept"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          check
                        </span>{" "}
                        Accept
                      </button>
                      <button
                        onClick={() => {}}
                        className="btn-subtle-grey"
                        title="Discard"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          close
                        </span>
                        Discard
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-slate-400 text-sm"
                >
                  No pending images for review.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TableFooter
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        page={page}
        setPage={setPage}
        totalRecord={data.length}
      />
    </section>
  );
};

export default ImageReview;
