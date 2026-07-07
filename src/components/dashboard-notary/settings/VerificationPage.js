"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CircleAlert, CircleCheckBig, Download, Eye, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchNotaryProfileDetails,
  selectSitePortal,
  submitNotaryVerificationForReview,
  uploadNotaryVerificationDocument,
} from "@/store/sitePortalSlice";
import { buildAssetUrl } from "@/lib/siteApi";

export default function VerificationPage() {
  const dispatch = useAppDispatch();
  const {
    notaryProfileDetails,
    notaryProfileDetailsStatus,
    notaryVerificationSubmitStatus,
    notaryVerificationUploadStatus,
  } = useAppSelector(selectSitePortal);
  const [activeUploadKey, setActiveUploadKey] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchNotaryProfileDetails());
  }, [dispatch]);

  const verification = notaryProfileDetails?.verification;
  const profileChecks = useMemo(
    () => verification?.profileChecks || [],
    [verification]
  );
  const documents = useMemo(
    () => verification?.documents || [],
    [verification]
  );
  const completionPercent = verification?.completionPercent ?? 0;
  const completedChecks = verification?.completedChecks ?? 0;
  const totalChecks = verification?.totalChecks ?? 0;
  const verificationStatus = verification?.status || "Pending";

  const completedDocuments = useMemo(
    () => documents.filter((doc) => doc.status !== "Missing").length,
    [documents]
  );

  const profileCompletedCount = useMemo(
    () => profileChecks.filter((field) => field.complete).length,
    [profileChecks]
  );

  const isPendingReview = verificationStatus === "Pending Review";
  const isVerified = verificationStatus === "Verified";
  const isRejected = verificationStatus === "Rejected";

  const handleUploadClick = (key) => {
    setActiveUploadKey(key);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !activeUploadKey) {
      event.target.value = "";
      return;
    }
    try {
      await dispatch(
        uploadNotaryVerificationDocument({ documentKey: activeUploadKey, file })
      ).unwrap();
      toast.success("Document uploaded.");
    } catch (error) {
      toast.error(error?.message || "Unable to upload document.");
    } finally {
      event.target.value = "";
      setActiveUploadKey(null);
    }
  };

  const handleSubmit = async () => {
    try {
      await dispatch(submitNotaryVerificationForReview()).unwrap();
      toast.success("Verification submitted for review.");
    } catch (error) {
      toast.error(error?.message || "Unable to submit verification.");
    }
  };

  const statusBadge = (() => {
    if (isVerified) {
      return <span className="text-emerald-600 text-sm font-bold uppercase">Verified</span>;
    }
    if (isRejected) {
      return <span className="text-rose-600 text-sm font-bold uppercase">Action Required</span>;
    }
    if (isPendingReview) {
      return <span className="text-blue-600 text-sm font-bold uppercase">In Review</span>;
    }
    return null;
  })();

  const submitting = notaryVerificationSubmitStatus === "loading";
  const uploading = notaryVerificationUploadStatus === "loading";
  const loading = notaryProfileDetailsStatus === "loading" && !notaryProfileDetails;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Verification</h2>
          <p className="mt-1 text-sm text-gray-700">
            Complete your profile fields and upload the required documents so our admin team can verify your notary credentials.
          </p>
        </div>
        {statusBadge}
      </div>

      <div className="bg-white border border-indigo-100 rounded-[24px] overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-2">
          <div className="p-6 border-r border-zinc-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Profile fields</h2>
              <p className="text-sm font-medium text-gray-700">
                {profileCompletedCount}/{profileChecks.length} Completed
              </p>
            </div>
            <div className="mt-6 space-y-4">
              {profileChecks.map((field) => (
                <div key={field.key} className="flex items-center justify-between px-4 py-4 rounded-2xl border border-zinc-200">
                  <div className="flex items-center gap-4">
                    {field.complete ? (
                      <CircleCheckBig className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-zinc-200"></div>
                    )}
                    <span className="text-zinc-700">{field.label}</span>
                  </div>
                  {field.actionLabel ? (
                    <span className="text-[#2c49df] font-bold text-sm">{field.actionLabel}</span>
                  ) : null}
                </div>
              ))}
              {profileChecks.length === 0 && !loading ? (
                <p className="text-sm text-gray-700 px-2">No profile checks configured.</p>
              ) : null}
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Required documents</h2>
              <p className="text-sm font-medium text-gray-700">
                {completedDocuments}/{documents.length} Uploaded
              </p>
            </div>
            <div className="mt-6 space-y-4">
              {documents.map((document) => {
                const hasFile = document.status !== "Missing";
                const displayStatus = document.displayStatus || document.status;
                const tone =
                  displayStatus === "Verified"
                    ? "bg-emerald-50 text-emerald-600"
                    : displayStatus === "Rejected"
                      ? "bg-rose-50 text-rose-600"
                      : hasFile
                        ? "bg-blue-50 text-blue-600"
                        : "bg-orange-50 text-orange-600";
                return (
                  <div key={document.key} className="flex items-center justify-between gap-3 px-4 py-4 rounded-2xl border border-zinc-200">
                    <div className="flex items-center gap-4 min-w-0">
                      {hasFile && document.status !== "Rejected" ? (
                        <CircleCheckBig className="w-6 h-6 text-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-zinc-200 shrink-0"></div>
                      )}
                      <div className="min-w-0">
                        <p className="text-zinc-700 truncate">{document.title}</p>
                        {document.fileName ? (
                          <p className="text-xs text-gray-700 truncate">{document.fileName}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${tone}`}>
                        {displayStatus}
                      </span>
                      {document.viewUrl ? (
                        <a
                          href={buildAssetUrl(document.viewUrl)}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`View ${document.title}`}
                          className="text-[#2c49df]"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      ) : null}
                      {document.downloadUrl ? (
                        <a
                          href={buildAssetUrl(document.downloadUrl)}
                          aria-label={`Download ${document.title}`}
                          className="text-[#2c49df]"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleUploadClick(document.key)}
                        disabled={uploading && activeUploadKey === document.key}
                        className="text-[#2c49df] inline-flex items-center gap-1 text-sm font-bold disabled:opacity-60"
                      >
                        {uploading && activeUploadKey === document.key ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        {hasFile ? "Replace" : "Upload"}
                      </button>
                    </div>
                  </div>
                );
              })}
              {documents.length === 0 && !loading ? (
                <p className="text-sm text-gray-700 px-2">No verification documents configured.</p>
              ) : null}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelected}
              className="hidden"
            />
            <div className="mt-6 bg-[#eef2ff] rounded-[24px] p-6 flex gap-4">
              <CircleAlert className="w-6 h-6 text-[#2c49df] shrink-0 mt-1" />
              <div>
                <p className="text-[#2c49df] font-bold">Processing Time</p>
                <p className="text-zinc-600 mt-3 leading-relaxed">
                  Required documents are typically reviewed within 24 business hours. You will receive a notification once your verification level is upgraded.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-zinc-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-32 h-3 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className="h-full bg-[#2c49df]"
                style={{ width: `${completionPercent}%` }}
              ></div>
            </div>
            <p className="text-sm font-medium text-gray-700">
              Overall Progress: {completionPercent}% ({completedChecks}/{totalChecks})
            </p>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || isPendingReview}
            className="px-6 py-4 rounded-2xl bg-[#2c49df] text-white font-bold shadow-lg shadow-blue-100 disabled:opacity-60"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
              </span>
            ) : isPendingReview ? (
              "Awaiting Admin Review"
            ) : isVerified ? (
              "Verified"
            ) : (
              "Submit for Review"
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-700 inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading verification status...
        </p>
      ) : null}
    </div>
  );
}