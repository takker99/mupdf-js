# based on
# https://github.com/microsoft/vcpkg/blob/2024.10.21/ports/libmupdf/CMakeLists.txt
vcpkg_check_linkage(ONLY_STATIC_LIBRARY)
vcpkg_from_github(
  OUT_SOURCE_PATH
  SOURCE_PATH
  REPO
  ArtifexSoftware/mupdf
  REF
  "${VERSION}"
  SHA512
  b3a3e9ba000d920641647b936c01bf88d6df4f3cd5635240fc50402e7ed1663015deb5de09f51c698181cb33ea4c76441a5bdbace81d6e472275afd02d0f84d7
  HEAD_REF
  master
  PATCHES
  dont-generate-extract-3rd-party-things.patch)

file(COPY "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt"
     DESTINATION "${SOURCE_PATH}")

vcpkg_cmake_configure(SOURCE_PATH "${SOURCE_PATH}" DISABLE_PARALLEL_CONFIGURE)

vcpkg_cmake_install()
file(REMOVE_RECURSE "${CURRENT_PACKAGES_DIR}/debug/include")
vcpkg_fixup_pkgconfig()
vcpkg_copy_pdbs()

vcpkg_install_copyright(FILE_LIST "${SOURCE_PATH}/COPYING")