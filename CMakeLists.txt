cmake_minimum_required(VERSION 3.30)

project(mupdf)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(CMAKE_INSTALL_PREFIX "..")

if(EMSCRIPTEN)
  set(VCPKG_INCLUDE_DIR ${VCPKG_INSTALLED_DIR}/${VCPKG_TARGET_TRIPLET}/include)
  set(EM_CPP_FLAGS
      -Wno-parentheses-equality
      -Wno-pointer-sign
      --use-port=freetype
      --use-port=icu
      --use-port=libpng
      -fno-rtti
      -fno-exceptions)

  set(EM_LINK_FLAGS
      --use-port=freetype
      --use-port=icu
      --use-port=libpng
      --disable-nls
      -sAUTO_JS_LIBRARIES=0
      -sAUTO_NATIVE_LIBRARIES=0
      -sEXIT_RUNTIME=0
      -Wno-experimental
      -sENVIRONMENT=web
      -sMODULARIZE=1
      -sEXPORT_ES6=1
      -sUSE_ES6_IMPORT_META=1
      -sINCOMING_MODULE_JS_API=preRun,postRun,onAbort,print,printErr,noExitRuntime,onProgress
      -sTEXTDECODER=2
      -sEXPORTED_FUNCTIONS=_compileBibtex,_compileLaTeX,_compileFormat,_setMainEntry,_malloc
      -sEXPORTED_RUNTIME_METHODS=ccall
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

  # See: https://github.com/emscripten-core/emscripten/blob/main/src/settings.js
  string(REPLACE ";" " " CPP_FLAGS "${EM_CPP_FLAGS}")

  string(REPLACE ";" " " LINK_FLAGS "${EM_LINK_FLAGS}")

  include_directories(${VCPKG_INCLUDE_DIR} ${CMAKE_CURRENT_BINARY_DIR})


endif()