DROP POLICY IF EXISTS "blog media public read" ON storage.objects;
CREATE POLICY "admin read own blog media" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'blog-media'
  AND owner_id = (SELECT auth.uid()::text)
  AND public.has_role((SELECT auth.uid()), 'admin'::public.app_role)
);
COMMENT ON POLICY "admin read own blog media" ON storage.objects IS 'Only the authenticated admin uploader can list files or mint download links. Visitors read published blog attachments through the signed URLs saved with posts.';