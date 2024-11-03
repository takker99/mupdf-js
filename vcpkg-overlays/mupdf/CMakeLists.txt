# based on
# https://github.com/microsoft/vcpkg/blob/2024.10.21/ports/libmupdf/CMakeLists.txt
cmake_minimum_required(VERSION 3.9)
project(mupdf)

set(CMAKE_DEBUG_POSTFIX d)

if(WIN32)
  execute_process(COMMAND "cmd.exe" "/c" "platform\\win32\\generate.bat"
                  WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}")
else()
  find_program(MAKE_EXE NAMES make REQUIRED)
  execute_process(COMMAND ${MAKE_EXE} "generate"
                  WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}")
endif()

find_package(freetype NO_MODULE REQUIRED)
find_package(JPEG REQUIRED)
find_path(HARFBUZZ_INCLUDE hb.h PATH_SUFFIXES harfbuzz)
find_library(HARFBUZZ_LIBRARIES harfbuzz)
find_package(ZLIB REQUIRED)
find_package(OpenJPEG CONFIG REQUIRED)
find_library(JBIG2DEC_LIB NAMES jbig2decd jbig2dec)

file(GLOB_RECURSE SOURCES "source/*.c" "generated/*.c" "source/*.h")
list(FILTER SOURCES EXCLUDE REGEX "source/tools/[a-z]*\\.c$")
list(FILTER SOURCES EXCLUDE REGEX "source/tests/.*.c$")
list(FILTER SOURCES EXCLUDE REGEX "source/fitz/output-docx.c")

add_library(mupdf ${SOURCES})

target_compile_definitions(
  mupdf
  PRIVATE -DSHARE_JPEG
          -DTOFU
          -DTOFU_CJK_EXT
          -DFZ_ENABLE_XPS=0
          -DFZ_ENABLE_SVG=0
          -DFZ_ENABLE_CBZ=0
          -DFZ_ENABLE_IMG=0
          -DFZ_ENABLE_HTML=0
          -DFZ_ENABLE_EPUB=0
          -DOCR_DISABLED=1
          -DFZ_ENABLE_OCR_OUTPUT=0
          -DFZ_ENABLE_JS=0
          -DFZ_ENABLE_ICC=0
          -DMEMENTO_MUPDF_HACKS
          -DFZ_ENABLE_DOCX_OUTPUT=0
          -DFZ_ENABLE_ODT_OUTPUT=0)

if(NOT WIN32)
  target_compile_definitions(mupdf PRIVATE -DHAVE_PTHREAD=1)
endif()

target_include_directories(
  mupdf
  PUBLIC include
  PRIVATE generated ${JPEG_INCLUDE_DIR} ${HARFBUZZ_INCLUDE})

target_link_libraries(
  mupdf PRIVATE openjp2 freetype ${JPEG_LIBRARIES} ${HARFBUZZ_LIBRARIES}
                ${JBIG2DEC_LIB} ZLIB::ZLIB)

install(
  TARGETS mupdf
  EXPORT mupdf
  RUNTIME DESTINATION bin
  LIBRARY DESTINATION lib
  ARCHIVE DESTINATION lib
  INCLUDES
  DESTINATION include)

install(DIRECTORY include/ DESTINATION include)