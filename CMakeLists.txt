cmake_minimum_required(VERSION 3.30)

project(mupdf-wasm)

# set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(CMAKE_INSTALL_PREFIX "..")

if(EMSCRIPTEN)
  set(EM_CPP_FLAGS -Wno-parentheses-equality -Wno-pointer-sign -fno-rtti
                   -fno-exceptions)

  set(EM_LINK_FLAGS
      --no-entry
      --disable-nls
      -sABORTING_MALLOC=0
      -sNODEJS_CATCH_EXIT=0
      -sAUTO_JS_LIBRARIES=0
      -sAUTO_NATIVE_LIBRARIES=0
      -sEXIT_RUNTIME=0
      -Wno-experimental
      -sENVIRONMENT=web
      -sMODULARIZE=1
      -sEXPORT_ES6=1
      -sUSE_ES6_IMPORT_META=1
      -sTEXTDECODER=2
      -sWASM_BIGINT=1
      --no-entry
      -sFILESYSTEM=0
      -sEXPORTED_RUNTIME_METHODS=ccall,UTF8ToString,lengthBytesUTF8,stringToUTF8
      -sALLOW_MEMORY_GROWTH=1
      -sPOLYFILL=0)

  if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    # set(EM_CPP_FLAGS ${EM_CPP_FLAGS} )
    list(
      APPEND
      EM_LINK_FLAGS
      -sSAFE_HEAP=1
      # -sSAFE_HEAP_LOG=1 -sLIBRARY_DEBUG=1
      -sEXCEPTION_DEBUG=1
      -sMALLOC=emmalloc-memvalidate-verbose
      -sASSERTIONS=2
      -gsource-map
      "--source-map-base ./" # Debugging c++ only works in browser with
                             # "Experimental DWARF support turned on"
    )
  else()
    list(APPEND EM_LINK_FLAGS -Os)
    list(APPEND EM_CPP_FLAGS -Os)
  endif()

  set(VCPKG_INCLUDE_DIR ${VCPKG_INSTALLED_DIR}/${VCPKG_TARGET_TRIPLET}/include)
  include_directories(${VCPKG_INCLUDE_DIR} ${CMAKE_CURRENT_BINARY_DIR})

  set(CMAKE_EXECUTABLE_SUFFIX ".mjs")

  add_executable(mupdf-wasm mupdf.c)
  add_library(mupdf STATIC IMPORTED)
  if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    set_target_properties(
      mupdf
      PROPERTIES
        IMPORTED_LOCATION
        ${VCPKG_INSTALLED_DIR}/${VCPKG_TARGET_TRIPLET}/debug/lib/libmupdfd.a)
  else()
    set_target_properties(
      mupdf
      PROPERTIES IMPORTED_LOCATION
                 ${VCPKG_INSTALLED_DIR}/${VCPKG_TARGET_TRIPLET}/lib/libmupdf.a)
  endif()
  find_package(freetype NO_MODULE REQUIRED)
  find_package(JPEG REQUIRED)
  find_package(OpenJPEG CONFIG REQUIRED)
  find_library(JBIG2DEC_LIB NAMES jbig2decd jbig2dec)
  target_link_libraries(mupdf-wasm PRIVATE mupdf openjp2 freetype
                                           ${JPEG_LIBRARIES} ${JBIG2DEC_LIB})
  target_compile_features(mupdf-wasm PRIVATE cxx_std_23)
  target_compile_definitions(mupdf-wasm PRIVATE WEBASSEMBLY_BUILD)
  # See: https://github.com/emscripten-core/emscripten/blob/main/src/settings.js
  string(REPLACE ";" " " CPP_FLAGS "${EM_CPP_FLAGS}")
  string(REPLACE ";" " " LINK_FLAGS "${EM_LINK_FLAGS}")
  set_target_properties(mupdf-wasm PROPERTIES COMPILE_FLAGS "${CPP_FLAGS}")
  set_target_properties(mupdf-wasm PROPERTIES LINK_FLAGS "${LINK_FLAGS}")

endif()
